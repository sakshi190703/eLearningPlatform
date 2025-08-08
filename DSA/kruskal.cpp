#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

class UnionFind {
private:
    vector<int> parent, rank;
public:
    UnionFind(int n) {
        parent.resize(n);
        rank.resize(n, 0);
        for (int i = 0; i < n; ++i) parent[i] = i;
    }
    
    int find(int x) {
        if (parent[x] != x) parent[x] = find(parent[x]);
        return parent[x];
    }
    
    bool unite(int x, int y) {
        int px = find(x), py = find(y);
        if (px == py) return false;
        if (rank[px] < rank[py]) swap(px, py);
        parent[py] = px;
        if (rank[px] == rank[py]) rank[px]++;
        return true;
    }
};

vector<pair<pair<int, int>, int>> kruskal(vector<pair<pair<int, int>, int>>& edges, int vertices) {
    sort(edges.begin(), edges.end(), [](const auto& a, const auto& b) {
        return a.second < b.second;
    });
    
    UnionFind uf(vertices);
    vector<pair<pair<int, int>, int>> mst;
    int totalWeight = 0;
    
    for (const auto& edge : edges) {
        int src = edge.first.first, dest = edge.first.second, weight = edge.second;
        if (uf.unite(src, dest)) {
            mst.push_back({{src, dest}, weight});
            totalWeight += weight;
        }
    }
    
    return mst;
}

int main() {
    int vertices = 4;
    // Edges: {{src, dest}, weight}
    vector<pair<pair<int, int>, int>> edges = {
        {{0, 1}, 2}, {{0, 2}, 3}, {{1, 3}, 4}, {{2, 3}, 5}
    };
    
    vector<pair<pair<int, int>, int>> mst = kruskal(edges, vertices);
    int totalWeight = 0;
    cout << "Kruskal's MST Edges:\n";
    for (const auto& edge : mst) {
        int src = edge.first.first, dest = edge.first.second, weight = edge.second;
        totalWeight += weight;
        cout << "(" << char('A' + src) << "," << char('A' + dest) << "," << weight << ")\n";
    }
    cout << "Total Weight: " << totalWeight << endl;
    
    return 0;
}