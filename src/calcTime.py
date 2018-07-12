int acc = 1 #m/s^2
int velVert = 5 #m/s vertical speed
int vetHor = 1 #m/s horizontal speed
int rotTime = 6 #s
int accelaraionTime = 5 #[s] time needed to go from 0 m/s to 5 m/s and vice versa

#If the elevator accelerates or brakes it needs 5 sec each time to do a full acceleration/stop

def accTime()
    accTime += accelaraionTime
    return accTime

#Time needed fo cambin to move the next destination
def velTime(distance)
    float timeV
    float timeOld
    timeOld = timeV
    if status is velocity:
        float timeVel = (vel/dist) +timeOld
        timeVel = round(timeVel, 2)
    return timeVel

#Complete time the cabin need (include accelaration and breaks) from point A to B
def compTime(velTime, accTime, boardingTime, rotationSpeed)
    float time
    time = velTime + accTime + boardingTime + rotationSpeed
    return time
compTime()

#Calculates the distance to stop until the elevator has to stop to reach the destination
def stoppingDistance(move)
    kmVel = (vel/1000)*3600
    float stopDist = (vel/10)*(vel/10)
    stopDist = round(stopDist,2)
    return stopDist
stopDistnace()

#Set the appropariet speed 5m/s vertical, 1m/s horizontal and moves the elevator
def move()
    if Case_Class_structure is "up" || "down":
        vel = vertVel
    else:
        vel = horVel
    return vel

#Time needed per person to get into the elevator 
def boardingTime(passengers)
    int boardtimeTime = 4 + passengers
    return boardTime

def rotationSpeed(numOfExchanger)
    int exchangeTime = numOfExchanger * rotTime
    return exchangeTime 

