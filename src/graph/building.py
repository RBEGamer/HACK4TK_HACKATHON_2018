import networkx as nx


class Building:

    def __init__(self):
        GRAPHML_DEFINITION = "building_definition.graphml"
        self.graph = nx.readwrite.graphml.read_graphml(GRAPHML_DEFINITION)

    def getFloorAttributes(self, floor_id):
        """
              returns a dictionary of floor attributes
                Args:
                    floor_id (str): The name of floor node in a graph

                Returns:
                    dict: {'position_in_graph_x': 1, 'position_in_graph_y': 2}
                """
        if(floor_id in self.graph.nodes):
            return self.graph.nodes[floor_id]
        else:
            return None

    def addElevatorToFloor(self, floor_id, elevator):
        """
        Sets a position of an elevator to be on a certain floor
        Args:
            floor_id (str): The name of floor node in a graph
            elevator (Elevator): Elevator object

        Returns:
            bool: The return value. True for success, False otherwise.
        """
        if(floor_id in self.graph.nodes):
            self.graph.nodes[floor_id]['elevator'] = elevator

            return True
        else:
            return False

    def getNodeNeighbours(self, node_id):
        succ = []
        for s in self.graph.successors(node_id):
            succ.append(s)
        return succ

    def showGraph(self):
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
