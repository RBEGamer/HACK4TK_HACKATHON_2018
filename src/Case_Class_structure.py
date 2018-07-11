from enum import Enum

class Passengers_Together:
    def __init__(self, num=0, list_passenger = []):
        self.id = id
        self.time_stamp = time_stamp
        self.num = num
        self.list_passenger = list_passenger
        self.start_position = start
        self.stop_position = stop
    
    def add_passenger(self, passenger):
        self.num += 1
        self.list_passenger.append(passenger)
        return

    def del_passenger(self, passenger):
        if self.list_passenger.contains(passenger):
            self.num -= 1
            self.list_passenger.remove(passenger)
            return True
        else:
            print ("no such passenger, something is wrong")
            return False
    
    def start_passenger(self, passenger):
        self.start_point = start 
        return

    def end_passeger(self, passenger):
        self.end_point
        return

        
    

class Cabin:
    oritation = Enum('oritation', ('go_up', 'go_down', 'go_left', 'go_right'))
    cabin_Count = 0
    def __init__(self, id, oritation = oritation.go_down, velocity = 0, position = [0,0], list_of_passengers = Passengers_Together() ):
        self.id = id
        self.oritation = oritation
        self.velocity = velocity
        self.position = position
        self.list_of_passengers = list_of_passengers
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
        return self.distance_to_top

    def get_list_of_passengers(self):
        return self.list_of_passengers
    
    def __del__(self):
        Cabin.cabin_Count -= 1
        print ("__del__")


#class Floor:
#class Passenger:

cabin0 = Cabin(0)
print (cabin0.oritation)
cabin0.set_oritation(Cabin.oritation.go_up)
print (cabin0.position)
cabin0.set_position([1,2])
print (cabin0.position)
