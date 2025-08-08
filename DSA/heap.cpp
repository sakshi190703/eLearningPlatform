#include <iostream>
#include <vector>
using namespace std;

// Function to heapify a subtree rooted at index i (max-heap for ascending)
void maxHeapify(vector<int>& arr, int n, int i) {
    int largest = i; // Initialize largest as root
    int left = 2 * i + 1; // Left child
    int right = 2 * i + 2; // Right child

    // If left child is larger than root
    if (left < n && arr[left] > arr[largest])
        largest = left;

    // If right child is larger than largest so far
    if (right < n && arr[right] > arr[largest])
        largest = right;

    // If largest is not root
    if (largest != i) {
        swap(arr[i], arr[largest]);
        maxHeapify(arr, n, largest); // Recursively heapify the affected subtree
    }
}

// Function to heapify a subtree rooted at index i (min-heap for descending)
void minHeapify(vector<int>& arr, int n, int i) {
    int smallest = i; // Initialize smallest as root
    int left = 2 * i + 1; // Left child
    int right = 2 * i + 2; // Right child

    // If left child is smaller than root
    if (left < n && arr[left] < arr[smallest])
        smallest = left;

    // If right child is smaller than smallest so far
    if (right < n && arr[right] < arr[smallest])
        smallest = right;

    // If smallest is not root
    if (smallest != i) {
        swap(arr[i], arr[smallest]);
        minHeapify(arr, n, smallest); // Recursively heapify the affected subtree
    }
}

// Function to perform heap sort in ascending order (using max-heap)
void heapSortAscending(vector<int>& arr) {
    int n = arr.size();

    // Build max-heap
    for (int i = n / 2 - 1; i >= 0; i--)
        maxHeapify(arr, n, i);

    // Extract elements from heap one by one
    for (int i = n - 1; i > 0; i--) {
        swap(arr[0], arr[i]); // Move current root to end
        maxHeapify(arr, i, 0); // Call maxHeapify on reduced heap
    }
}

// Function to perform heap sort in descending order (using min-heap)
void heapSortDescending(vector<int>& arr) {
    int n = arr.size();

    // Build min-heap
    for (int i = n / 2 - 1; i >= 0; i--)
        minHeapify(arr, n, i);

    // Extract elements from heap one by one
    for (int i = n - 1; i > 0; i--) {
        swap(arr[0], arr[i]); // Move current root to end
        minHeapify(arr, i, 0); // Call minHeapify on reduced heap
    }
}

// Function to print array
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