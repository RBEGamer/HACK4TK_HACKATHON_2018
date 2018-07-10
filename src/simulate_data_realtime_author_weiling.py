import time
import csv

#change speed_up_ratio to decide how speedy you want the data to play
speed_up_ratio = 1
time_DB = []
start_floor_DB = []
dest_floor_DB = []

#code from Anton
def run_simulation():
    with open('../data/MorningTraffic-b.csv', 'r') as file:
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


count = 0
starting_line = int(time.time())

#timeArray = time.localtime(starting_line)
#otherStyleTime = time.strftime("%Y-%m-%d %H:%M:%S", timeArray)

while(count<len(time_DB)):
    goal = round(float(time_DB[count]) / speed_up_ratio + 1 ,1)
    if abs(round(float(time.time()-starting_line),2) - goal) < 0.1:
        print('Time:'+str(time_DB[count])+'. Elevator ordered from: '+start_floor_DB[count]+', to: '+dest_floor_DB[count])
        count += 1


