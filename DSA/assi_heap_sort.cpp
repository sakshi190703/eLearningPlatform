#include <iostream>
#include <vector>
using namespace std;

// Function to heapify a subtree rooted at index i (max-heap for ascending)
void maxHeapify(vector<int>& arr, int n, int i) {
    int largest = i; 
    int left = 2 * i + 1; // Left child
    int right = 2 * i + 2; // Right child

    if (left < n && arr[left] > arr[largest])
        largest = left;

    if (right < n && arr[right] > arr[largest])
        largest = right;

    if (largest != i) {
        swap(arr[i], arr[largest]);
        maxHeapify(arr, n, largest); 
    }
}

// Function to heapify a subtree rooted at index i (min-heap for descending)
void minHeapify(vector<int>& arr, int n, int i) {
    int smallest = i; 
    int left = 2 * i + 1; // Left child
    int right = 2 * i + 2; // Right child

    if (left < n && arr[left] < arr[smallest])
        smallest = left;

    if (right < n && arr[right] < arr[smallest])
        smallest = right;

    if (smallest != i) {
        swap(arr[i], arr[smallest]);
        minHeapify(arr, n, smallest); 
    }
}

void heapSortAscending(vector<int>& arr) {
    int n = arr.size();

  
    for (int i = n / 2 - 1; i >= 0; i--)
        maxHeapify(arr, n, i);

 
    for (int i = n - 1; i > 0; i--) {
        swap(arr[0], arr[i]); 
        maxHeapify(arr, i, 0);
    }
}

void heapSortDescending(vector<int>& arr) {
    int n = arr.size();

    for (int i = n / 2 - 1; i >= 0; i--)
        minHeapify(arr, n, i);

    for (int i = n - 1; i > 0; i--) {
        swap(arr[0], arr[i]); 
        minHeapify(arr, i, 0); 
    }
}

void printArray(const vector<int>& arr) {
    for (int x : arr)
        cout << x << " ";
    cout << endl;
}

int main() {
    int n;
    cout << "Enter the number of elements: ";
    cin >> n;

    vector<int> arr(n);
    cout << "Enter " << n << " elements: ";
    for (int i = 0; i < n; i++)
        cin >> arr[i];

    // Store original array for both sorting orders
    vector<int> arrAsc = arr;
    vector<int> arrDesc = arr;

    int choice;
    do {
        cout << "\nHeap Sort Menu:\n";
        cout << "1. Sort in Ascending Order\n";
        cout << "2. Sort in Descending Order\n";
        cout << "3. Exit\n";
        cout << "Enter your choice: ";
        cin >> choice;

        switch (choice) {
            case 1:
                heapSortAscending(arrAsc);
                cout << "Array sorted in ascending order: ";
                printArray(arrAsc);
                break;
            case 2:
                heapSortDescending(arrDesc);
                cout << "Array sorted in descending order: ";
                printArray(arrDesc);
                break;
            case 3:
                cout << "Exiting...\n";
                break;
            default:
                cout << "Invalid choice! Try again.\n";
        }
    } while (choice != 3);

    return 0;
}