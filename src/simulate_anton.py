import time
def run_simulation():
    with open('./data/MorningTraffic-b.csv', 'r') as file:
        content = file.readlines()
        content = [x.strip() for x in content]
        timestep = 0
        while True:
            if len(content) > 0:
                parts = content[0].split(';')
                start_time = parts[0]
                if int(start_time) == timestep:
                    start_floor = parts[1]
                    dest_floor = parts[2]
                    print('Time:'+str(timestep)+'. Elevator ordered from: '+start_floor+', to: '+dest_floor)
                    content.pop(0)
                else:
                    print('Time:'+str(timestep)+'. Nobody wants an elevator now')
                timestep += 1
                #sleep to slow the process down
                #time.sleep(0.1)


            else:
                print('Simulation over')
                break

run_simulation()
