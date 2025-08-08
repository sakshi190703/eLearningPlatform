#include <iostream>
#include <vector>
#include <queue>
#include <utility>
using namespace std;

typedef pair<int, int> pii; // {weight, vertex}

vector<pair<int, int>> prim(vector<vector<pii>>& graph, int vertices) {
    vector<bool> visited(vertices, false);
    priority_queue<pii, vector<pii>, greater<pii>> minHeap; // {weight, dest}
    vector<pair<int, int>> mst; // {src, dest}
    int start = 0; // Start from vertex 0

    visited[start] = true;
    for (const auto& edge : graph[start]) {
        minHeap.push({edge.second, edge.first}); // {weight, dest}
    }

    while (!minHeap.empty() && mst.size() < vertices - 1) {
        int weight = minHeap.top().first;
        int dest = minHeap.top().second;
        minHeap.pop();

        if (visited[dest]) continue;

        visited[dest] = true;
        mst.push_back({start, dest}); // Store edge (src, dest)
        start = dest; // Update source for next edge

        for (const auto& edge : graph[dest]) {
            if (!visited[edge.first]) {
                minHeap.push({edge.second, edge.first});
            }
        }
    }

    return mst;
}

int main() {
    int vertices = 4;
    // Graph as adjacency list: {vertex, weight}
    vector<vector<pii>> graph = {
        {{1, 2}, {2, 3}},           // A: (B,2), (C,3)
        {{0, 2}, {3, 4}},           // B: (A,2), (D,4)
        {{0, 3}, {3, 5}},           // C: (A,3), (D,5)
        {{1, 4}, {2, 5}}            // D: (B,4), (C,5)
    };

    vector<pair<int, int>> mst = prim(graph, vertices);
    int totalWeight = 0;
    cout << "Prim's MST Edges:\n";
    for (const auto& edge : mst) {
        int src = edge.first, dest = edge.second;
        for (const auto& e : graph[src]) {
            if (e.first == dest) {
                totalWeight += e.second;
                cout << "(" << char('A' + src) << "," << char('A' + dest) << "," << e.second << ")\n";
            }
        }
    }
    cout << "Total Weight: " << totalWeight << endl;

    return 0;
}