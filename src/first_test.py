import paho.mqtt.client as mqtt
import time
import csv
old_time_slop = 0
def on_connect(client, userdata, flags, rc):
    print("Connected with result code "+str(rc))

    # Subscribing in on_connect() means that if we lose the connection and
    # reconnect then subscriptions will be renewed.
    client.subscribe("elevator_start_simulation")
    client.subscribe("elevator_person_call")
    

# The callback for when a PUBLISH message is received from the server.
def on_message(client, userdata, msg):
    print(msg.topic+" "+str(msg.payload))

client = mqtt.Client()
client.on_connect = on_connect
client.on_message = on_message

client.connect("marcelochsendorf.com", 1883, 60)

# Blocking call that processes network traffic, dispatches callbacks and
# handles reconnecting.
# Other loop*() functions are available that give a threaded interface and a
# manual interface.


from enum import Enum

class Passenger:
    def __init__(self, id, time_passenger = -1, start_passenger = -1000, dist_passenger = -1000, assigned = False, stepped = False):
        self.id = id
        self.time_passenger = time_passenger
        self.start_passenger = start_passenger
        self.dist_passenger = dist_passenger
    
    def set_assigned(self, assigned):
        self.assigned = assigned
        return
    
    def set_stepped(self, stepped):
        self.stepped = stepped
        return

    def get_assigned(self):
        return self.assigned
    
    def get_stepped(self, stepped):
        return self.stepped

class Passengers_Together:
    def __init__(self, num=0, list_passenger = []):
        self.num = num
        self.list_passenger = list_passenger
    
    def add_passenger(self, Passenger):
        self.num += 1
        self.list_passenger.append(Passenger)
        return

    def del_passenger(self, passenger):
        if Passenger in self.list_passenger:
            self.num -= 1
            self.list_passenger.remove(Passenger)
            return True
        else:
            return False
        
    

class Cabin:
    oritation = Enum('oritation', ('go_up', 'go_down', 'go_left', 'go_right'))
    cabin_Count = 0
    def __init__(self, id, oritation = oritation.go_up, velocity = 0, position = [0,0]):
        self.id = id
        self.oritation = oritation
        self.velocity = velocity
        self.position = position
        self.list_of_passengers =  Passengers_Together()
        Cabin.cabin_Count += 1

    def set_oritation(self, oritation):
        self.oritation = oritation
        return

    def set_velocity(self, velocity):
        self.velocity = velocity
        return
    
    def set_position(self, position):
        self.position = position
        return
    
    def get_oritation(self):
        return self.oritation

    def get_velocity(self):
        return self.velocity

    def get_position(self):
        return self.position

    def get_list_of_passengers(self):
        return self.list_of_passengers
    
    def __del__(self):
        Cabin.cabin_Count -= 1
        print "__del__"


#change speed_up_ratio to decide how speedy you want the data to play
speed_up_ratio = 50
time_DB = []
start_floor_DB = []
dest_floor_DB = []

#code from Anton
def run_simulation():
    with open('../documentation/test_data/MorningTraffic-b.csv', 'r') as file:
        content = file.readlines()
        content = [x.strip() for x in content]
        timestep = 0
        while True:
            if len(content) > 0:
                parts = content[0].split(';')
                start_time = parts[0]
                time_DB.append(start_time)
                start_floor = parts[1]
                start_floor_DB.append(start_floor)
                dest_floor = parts[2]
                dest_floor_DB.append(dest_floor)
                content.pop(0)
            else:
                break

run_simulation()

cabin_awake = []
cabin_awake.append(Cabin(0))
cabin_awake.append(Cabin(1))
cabin_awake.append(Cabin(2))

cabin_awake[0].position = [0,8]
cabin_awake[1].position = [0,4]
cabin_awake[2].position = [0,0]

count = 0
starting_line = int(time.time())

def coordinate(current_passenger):
    if current_passenger.start_passenger < current_passenger.dist_passenger:
        x = 0
    else:
        x = 1
    height_start = (int(current_passenger.start_passenger) - 2)*4 + 60
    height_dist = (int(current_passenger.dist_passenger) - 2)*4 + 60
    return [x,height_start],[x,height_dist]

def need_stop(current_passenger, array_current_passenger):
    pick_up_coordinate, let_go_coordinate = coordinate(current_passenger)
    stops=[]
    for i in array_current_passenger:
        pick_up_i, let_go_i = coordinate(i)
        if pick_up_coordinate[0] == pick_up_i[0] and pick_up_i[0] == 0 and let_go_i[1] < let_go_coordinate[1]:
            stops.aplet_go_coordinatepend(let_go_i[1])
        if pick_up_coordinate[0] == pick_up_i[0] and pick_up_i[0] == 1 and let_go_i[1] > let_go_coordinate[1]:
            stops.append(let_go_i[1])
    return stops

def need_wait(current_passenger, array_current_passenger):
    speed = 5
    pick_up_coordinate, let_go_coordinate = coordinate(current_passenger)
    waits=[]
    for i in array_current_passenger:
        pick_up_i, let_go_i = coordinate(i)
        waits.append(let_go_i[1])
    if pick_up_coordinate == 0:
        return max(waits) / speed + 6
    else:
        return (120-min(waits))/ speed + 6




def single_cabin_weight(current_passenger, i):
    speed = 5
    pick_up_coordinate, let_go_coordinate = coordinate(current_passenger)
    cabin = cabin_awake[i]
    waiting_for_empty = 0
    delay2 = 0
    rotation = False
    if cabin.list_of_passengers.num >= 8:
        delay = 0
        waiting_for_empty = need_wait(current_passenger, cabin.list_of_passengers.list_passenger)
        stops = []
        delay = 6 * len(stops) + 6
        if cabin.position[0] == pick_up_coordinate[0]:
            delay2 = 0
            travel = abs(let_go_coordinate[1] - cabin.position[1])
        elif cabin.position[0] < pick_up_coordinate[0]:
            delay2 = 6
            travel = abs(let_go_coordinate[1]) + abs(cabin.position[1])
        else:
            delay2 = 6
            travel = 240 - abs(let_go_coordinate[1]) + abs(cabin.position[1])
    elif cabin.list_of_passengers.num >= 0:
        stops = []
        delay = 6 * len(stops) + 6
        if cabin.position[0] == pick_up_coordinate[0]:
            delay2 = 0
            travel = abs(let_go_coordinate[1] - cabin.position[1])
        elif cabin.position[0] < pick_up_coordinate[0]:
            delay2 = 6
            travel = abs(let_go_coordinate[1]) + abs(cabin.position[1])
        else:
            delay2 = 6
            travel = 240 - abs(let_go_coordinate[1]) + abs(cabin.position[1])
    else:
        stops = need_stop(current_passenger, cabin.list_of_passengers)
        delay = 6 * len(stops) + 6
        rotation = True
        if cabin.position[0] == pick_up_coordinate[0]:
            delay2 = 0
            travel = abs(let_go_coordinate[1] - cabin.position[1])
        elif cabin.position[0] < pick_up_coordinate[0]:
            delay2 = 6
            travel = abs(let_go_coordinate[1]) + abs(cabin.position[1])
        else:
            delay2 = 6
            travel = 240 - abs(let_go_coordinate[1]) + abs(cabin.position[1])
    return delay + delay2 + travel / speed + waiting_for_empty, rotation

        

#brute force greedy
def time_calculation(current_passenger):
    min = 300
    selected = -1
    for i in range(0,Cabin.cabin_Count):
        print single_cabin_weight(current_passenger, i)[0]
        if single_cabin_weight(current_passenger, i) [0]< min:
            min = single_cabin_weight(current_passenger, i)
            rotaion = single_cabin_weight(current_passenger, i) [1]
            selected = i
    cabin_awake[selected].list_of_passengers.add_passenger(current_passenger)
    if single_cabin_weight(current_passenger, i) [1] == True:
        if cabin_awake[selected].oritation == Cabin.oritation.go_down:
            cabin_awake[selected].set_oritation(Cabin.oritation.go_up)
        else:
            cabin_awake[selected].set_oritation(Cabin.oritation.go_down)
    return selected

def cabin_pass_sort(cabin):
    y = []
    for i in cabin.list_of_passengers.list_passenger:
        pick_up_i, let_go_i = coordinate(i)
        x = let_go_i[0]
        y.append(let_go_i[1])
    sorted_y = sorted(y)
    return sorted_y

def find_to_delete(cabin, y):
    index = -1
    for i in cabin.list_of_passengers.list_passenger:
        pick_up_i, let_go_i = coordinate(i)
        if let_go_i[1] == y:
            return index
        else:
            index += 0
    

def cabin_update(cabin_awake,time_slop):
    print "time_slop is"
    print time_slop
    speed = 5
 
    for i in cabin_awake:
        temp_x =i.get_position()[0]
        temp_y =i.get_position()[1]
        y = cabin_pass_sort(i)
        old_height_index = cabin_awake[0].position
        old_height = old_height_index[1]
        if i.get_oritation() == Cabin.oritation.go_up:
            temp_x =i.get_position()[0]
            temp_y =i.get_position()[1] + time_slop * speed
            #i.set_position([i.get_position()[0],i.get_position()[1]+ time_slop * 5])
            #for j in range(0,len(y)):
            #    if (old_height + time_slop * speed) > y[j]:
            #        temp_y= temp_y -speed *(time_slop-(y[j]-old_height)/speed)
                    #i.set_position([i.get_position()[0], i.get_position()[1] - 5*(time_slop-(y[j]-old_height)/5)])
            #        i.list_of_passengers.del_passenger(i.list_of_passengers.list_passenger[find_to_delete(i,y[j])])
                    #i.set_position([temp_x,temp_y])

            if temp_y >= 120:
        #if (old_height + time_slop * speed) >= 120:
                temp_x = (temp_x+1)%2
                temp_y = abs(240-temp_y)
            #i.set_position([(i.get_position()[0]+1)%2, (240-i.get_position()[1])])
                i.set_oritation(Cabin.oritation.go_down)
            i.set_position([temp_x,temp_y])
        
        else:
            temp_x = 1
            #temp_x =i.get_position()[0]
            temp_y =i.get_position()[1] - time_slop * speed
            #i.set_position([i.get_position()[0],i.get_position()[1] - time_slop * 5])
            #for j in range(0,len(y)):
            #    if (old_height  + time_slop* speed ) < y[len(y)-j-1]:
            #        temp_y= temp_y + speed * (time_slop-abs(y[len(y)-j-1]-old_height)/speed)
                    #i.set_position([i.get_position()[0],i.get_position()[1] + 5*(time_slop-abs(y[len(y)-j-1]-old_height)/5)])
            #        i.list_of_passengers.del_passenger(i.list_of_passengers.list_passenger[find_to_delete(i,y[len(y)-j-1])])
                    #i.set_position([temp_x,temp_y])

            if temp_y < 0:
            #if (old_height + time_slop * speed) < 0:
                temp_x = (temp_x+1)%2
                temp_y = abs(temp_y)
            #i.set_position([(i.get_position()[0]+1)%2, abs(i.get_position()[1])])
                i.set_oritation(Cabin.oritation.go_up)
            i.set_position([temp_x,temp_y])


        #i.set_position([temp_x,temp_y])

client.loop_start()        

while(count<len(time_DB)):

    time_slop = round(float(time.time()-starting_line),2)
    new_time_slop = time_slop - old_time_slop
    old_time_slop = time_slop
    time.sleep(0.1)
    #cabin_awake[0].set_position([cabin_awake[0].position[0],abs(cabin_awake[0].position[1])%120+1])
    #cabin_awake[1].set_position([cabin_awake[1].position[0],abs(cabin_awake[1].position[1])%120+1])
    #cabin_awake[2].set_position([cabin_awake[2].position[0],abs(cabin_awake[2].position[1])%120+1])
    #cabin_awake[1].position
    #cabin_awake[2].position
    
    #client.publish("elevator_pos_update", "{\"x\":\""+str(cabin_awake[0].position[0]+1)+"\",\"y\":\""+str(abs(cabin_awake[0].position[1])%120+1)+"\",\"timestamp\":\""+str(time.time())+"\",\"uuid\":\"0\"}")
    #client.publish("elevator_pos_update", "{\"x\":\""+str(cabin_awake[1].position[0]+1)+"\",\"y\":\""+str(abs(cabin_awake[1].position[1])%120+1)+"\",\"timestamp\":\""+str(time.time())+"\",\"uuid\":\"1\"}")
    #client.publish("elevator_pos_update", "{\"x\":\""+str(cabin_awake[2].position[0]+1)+"\",\"y\":\""+str(abs(cabin_awake[2].position[1])%120+1)+"\",\"timestamp\":\""+str(time.time())+"\",\"uuid\":\"2\"}")
    #client.publish("elevator_pos_update", "{\"x\":\""+str(cabin_awake[0].position[0]+1)+"\",\"y\":\""+str(cabin_awake[0].position[1]+1)+"\",\"timestamp\":\""+str(time.time())+"\",\"uuid\":\"0\"}")
    #client.publish("elevator_pos_update", "{\"x\":\""+str(cabin_awake[1].position[0]+1)+"\",\"y\":\""+str(cabin_awake[1].position[1]+1)+"\",\"timestamp\":\""+str(time.time())+"\",\"uuid\":\"1\"}")
    #client.publish("elevator_pos_update", "{\"x\":\""+str(cabin_awake[2].position[0]+1)+"\",\"y\":\""+str(cabin_awake[2].position[1]+1)+"\",\"timestamp\":\""+str(time.time())+"\",\"uuid\":\"2\"}")

    print cabin_awake[0].position
    client.publish("elevator_pos_update", "{\"x\":\""+str(cabin_awake[0].position[0]+1)+"\",\"y\":\""+str(int(cabin_awake[0].position[1]-56)/4+1)+"\",\"timestamp\":\""+str(time.time())+"\",\"uuid\":\"0\"}")
    print cabin_awake[1].position
    client.publish("elevator_pos_update", "{\"x\":\""+str(cabin_awake[1].position[0]+1)+"\",\"y\":\""+str(int(cabin_awake[1].position[1]-56)/4+1)+"\",\"timestamp\":\""+str(time.time())+"\",\"uuid\":\"1\"}")
    print cabin_awake[2].position
    client.publish("elevator_pos_update", "{\"x\":\""+str(cabin_awake[2].position[0]+1)+"\",\"y\":\""+str(int(cabin_awake[2].position[1]-56)/4+1)+"\",\"timestamp\":\""+str(time.time())+"\",\"uuid\":\"2\"}")
  

    cabin_update(cabin_awake,new_time_slop)
    goal = round(float(time_DB[count]) / speed_up_ratio + 1 ,1)
    if abs(round(float(time.time()-starting_line),2) - goal) < 0.1:
        

        print cabin_awake[0].position
        client.publish("elevator_person_update", "{\"x\":\""+str(1)+"\",\"y\":\""+str(start_floor_DB[count])+"\",\"timestamp\":\""+str(time.time())+"\",\"uuid\":\""+str(count)+"\",\"state\":\"0\"}")

       
        current_passenger = Passenger(count, time_DB[count], start_floor_DB[count], dest_floor_DB[count])
        #print('Time:'+str(time_DB[count])+'. Elevator ordered from: '+start_floor_DB[count]+', to: '+dest_floor_DB[count])
        count += 1
        #print cabin_awake[0].position
        client.publish("elevator_pos_update", "{\"x\":\""+str(cabin_awake[0].position[0]+1)+"\",\"y\":\""+str(int(cabin_awake[0].position[1]-56)/4+1)+"\",\"timestamp\":\""+str(time.time())+"\",\"uuid\":\"0\"}")
        #print cabin_awake[1].position
        client.publish("elevator_pos_update", "{\"x\":\""+str(cabin_awake[1].position[0]+1)+"\",\"y\":\""+str(int(cabin_awake[1].position[1]-56)/4+1)+"\",\"timestamp\":\""+str(time.time())+"\",\"uuid\":\"1\"}")
        #print cabin_awake[2].position
        client.publish("elevator_pos_update", "{\"x\":\""+str(cabin_awake[2].position[0]+1)+"\",\"y\":\""+str(int(cabin_awake[2].position[1]-56)/4+1)+"\",\"timestamp\":\""+str(time.time())+"\",\"uuid\":\"2\"}")
        print time_calculation(current_passenger)
        count += 1

        



