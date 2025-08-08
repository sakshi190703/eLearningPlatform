/// ads lab 4 spanning tree kruskal's algo , using disjoint sets with the new concept of rank and utimate parent
#include<bits/stdc++.h>
using namespace std;

class edge{
    public:
    int src, dst, weight;
};

class graph{
    public:
    int v, e;
    edge* edg;
};

//function to create a graph with v vertices and e edges
graph* createGraph(int v, int e){
    graph* grp = new graph;
    grp -> v = v;
    grp -> e = e;
    grp->edg = new edge[e];
    return grp;
}

//subset class for union-find
class subset{
    public:
    int parent;
    int rank;
};

//find function with path compression
int find(subset subsets[], int i){
    if(subsets[i].parent != i){
        subsets[i].parent = find(subsets, subsets[i].parent);
    }
    return subsets[i].parent;
}

int main(){
    int v, e;
    cout<<"enter total vertices";
    cin>>v;
    cout<<"enter total edges : ";
    cin>> 
}

void union(subset subset[], int x, int y){
    int xroot = find(subsets, x);
    int yroot = find(subsets, y);

    if(subsets[xroot].rank < subsets[yroot].rank){
        subsets[xroot].parent = yroot;
    }else if(subsets[xroot].rank){

    }
}