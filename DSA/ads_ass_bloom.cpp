#include <iostream>
#include <vector>
#include <string>
#include <algorithm>
using namespace std;

// Simple hash functions for demonstration (replace with robust hash functions in production)
unsigned int hash1(const string& s, int size) {
    unsigned int hash = 0;
    for (char c : s) hash = (hash * 31 + c) % size;
    return hash;
}

unsigned int hash2(const string& s, int size) {
    unsigned int hash = 0;
    for (char c : s) hash = (hash * 17 + c) % size;
    return hash;
}

unsigned int hash3(const string& s, int size) {
    unsigned int hash = 0;
    for (char c : s) hash = (hash * 23 + c) % size;
    return hash;
}

// Bloom Filter Implementation
class BloomFilter {
private:
    vector<bool> bits;
    int size, k; // Size of bit array, number of hash functions

public:
    BloomFilter(int m, int k) : size(m), k(k) {
        bits.assign(m, false);
    }

    void insert(const string& item) {
        bits[hash1(item, size)] = true;
        bits[hash2(item, size)] = true;
        if (k > 2) bits[hash3(item, size)] = true;
    }

    bool query(const string& item) {
        if (!bits[hash1(item, size)] || !bits[hash2(item, size)]) return false;
        if (k > 2 && !bits[hash3(item, size)]) return false;
        return true;
    }
};

// Count-Min Sketch Implementation
class CountMinSketch {
private:
    vector<vector<int>> counters;
    int depth, width; // Number of hash functions, width of each row

public:
    CountMinSketch(int d, int w) : depth(d), width(w) {
        counters.assign(d, vector<int>(w, 0));
    }

    void insert(const string& item) {
        counters[0][hash1(item, width)]++;
        counters[1][hash2(item, width)]++;
        if (depth > 2) counters[2][hash3(item, width)]++;
    }

    int query(const string& item) {
        int minCount = counters[0][hash1(item, width)];
        minCount = min(minCount, counters[1][hash2(item, width)]);
        if (depth > 2) minCount = min(minCount, counters[2][hash3(item, width)]);
        return minCount;
    }
};

int main() {
    // Initialize Bloom Filter (m=100 bits, k=3 hash functions)
    BloomFilter bf(100, 3);
    // Initialize Count-Min Sketch (d=3 rows, w=50 columns)
    CountMinSketch cms(3, 50);

    int choice;
    string item;
    do {
        cout << "\nProbabilistic Data Structures Menu:\n";
        cout << "1. Insert into Bloom Filter\n";
        cout << "2. Query Bloom Filter\n";
        cout << "3. Insert into Count-Min Sketch\n";
        cout << "4. Query Count-Min Sketch\n";
        cout << "5. Exit\n";
        cout << "Enter your choice: ";
        cin >> choice;
        cin.ignore(); // Clear newline

        switch (choice) {
            case 1:
                cout << "Enter item to insert into Bloom Filter: ";
                getline(cin, item);
                bf.insert(item);
                cout << "Inserted '" << item << "' into Bloom Filter.\n";
                break;
            case 2:
                cout << "Enter item to query in Bloom Filter: ";
                getline(cin, item);
                if (bf.query(item))
                    cout << "'" << item << "' is likely present.\n";
                else
                    cout << "'" << item << "' is definitely not present.\n";
                break;
            case 3:
                cout << "Enter item to insert into Count-Min Sketch: ";
                getline(cin, item);
                cms.insert(item);
                cout << "Inserted '" << item << "' into Count-Min Sketch.\n";
                break;
            case 4:
                cout << "Enter item to query in Count-Min Sketch: ";
                getline(cin, item);
                cout << "Estimated count of '" << item << "': " << cms.query(item) << "\n";
                break;
            case 5:
                cout << "Exiting...\n";
                break;
            default:
                cout << "Invalid choice! Try again.\n";
        }
    } while (choice != 5);

    return 0;
}