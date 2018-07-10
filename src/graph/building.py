import networkx as nx


class Building:

    def __init__(self):
        GRAPHML_DEFINITION = "building_definition.graphml"
        self.graph = nx.readwrite.graphml.read_graphml(GRAPHML_DEFINITION)

    def showGraph():
	import matplotlib.pyplot as plt
	nx.draw(self.graph, nodecolor='r', edge_color='b')
	plt.show()




##################################
# Here we generate the graphML
##################################
#up
'''
for i in range(1, 17):
    thisfloor = str(i)
    nextfloor = str(i+1)
    print('<edge id="floor'+thisfloor+'_1_floor'+nextfloor+'_1" source="floor'+thisfloor+'_1" target="floor'+nextfloor+'_1">')
    print('\t<data key="height">4</data>')
    print('</edge>')
'''
#down
'''
for i in range(2, 18):
    thisfloor = str(i)
    nextfloor = str(i-1)
    print('<edge id="floor'+thisfloor+'_2_floor'+nextfloor+'_2" source="floor'+thisfloor+'_2" target="floor'+nextfloor+'_2">')
    print('\t<data key="height">4</data>')
    print('</edge>')
'''

'''
for i in range(1, 18):
    print('<node id="floor'+str(i) + '_1">')
    print('\t<data key="position_x" >1</data>')
    print('\t<data key="position_y" >'+str(i)+'</data>')
    print('</node>')
'''
