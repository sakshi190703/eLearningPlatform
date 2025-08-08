#include <iostream>
#include <stack>
using namespace std;

struct Node {
    int data;
    Node* left;
    Node* right;
    int height;
    Node(int val) {
        data = val;
        left = right = nullptr;
        height = 1;
    }
};

int getHeight(Node* node) {
    return node ? node->height : 0;
}

int getBalance(Node* node) {
    return node ? getHeight(node->left) - getHeight(node->right) : 0;
}

int max(int a, int b) {
    return (a > b) ? a : b;
}

// Right Rotation
Node* rotateRight(Node* unbalancedNode) {
    Node* leftChild = unbalancedNode->left;
    Node* tempSubtree = leftChild->right;

    leftChild->right = unbalancedNode;
    unbalancedNode->left = tempSubtree;

    unbalancedNode->height = 1 + max(getHeight(unbalancedNode->left), getHeight(unbalancedNode->right));
    leftChild->height = 1 + max(getHeight(leftChild->left), getHeight(leftChild->right));

    return leftChild;
}

// Left Rotation
Node* rotateLeft(Node* unbalancedNode) {
    Node* rightChild = unbalancedNode->right;
    Node* tempSubtree = rightChild->left;

    rightChild->left = unbalancedNode;
    unbalancedNode->right = tempSubtree;

    unbalancedNode->height = 1 + max(getHeight(unbalancedNode->left), getHeight(unbalancedNode->right));
    rightChild->height = 1 + max(getHeight(rightChild->left), getHeight(rightChild->right));

    return rightChild;
}

Node* insert(Node* node, int key) {
    if (!node) return new Node(key);

    if (key < node->data)
        node->left = insert(node->left, key);
    else if (key > node->data)
        node->right = insert(node->right, key);
    else
        return node; 

    node->height = 1 + max(getHeight(node->left), getHeight(node->right));
    int balance = getBalance(node);

    
    if (balance > 1 && key < node->left->data)
        return rotateRight(node);
    if (balance < -1 && key > node->right->data)
        return rotateLeft(node);
    if (balance > 1 && key > node->left->data) {
        node->left = rotateLeft(node->left);
        return rotateRight(node);
    }
    if (balance < -1 && key < node->right->data) {
        node->right = rotateRight(node->right);
        return rotateLeft(node);
    }

    return node;
}


void inorderRecursive(Node* node) {
    if (!node) return;
    inorderRecursive(node->left);
    cout << node->data << " ";
    inorderRecursive(node->right);
}

void preorderRecursive(Node* node) {
    if (!node) return;
    cout << node->data << " ";
    preorderRecursive(node->left);
    preorderRecursive(node->right);
}

void postorderRecursive(Node* node) {
    if (!node) return;
    postorderRecursive(node->left);
    postorderRecursive(node->right);
    cout << node->data << " ";
}

// Non-recursive traversals
void inorderNonRecursive(Node* root) {
    stack<Node*> s;
    Node* current = root;

    while (current || !s.empty()) {
        while (current) {
            s.push(current);
            current = current->left;
        }
        current = s.top();
        s.pop();
        cout << current->data << " ";
        current = current->right;
    }
}

void preorderNonRecursive(Node* root) {
    if (!root) return;
    stack<Node*> s;
    s.push(root);
    while (!s.empty()) {
        Node* node = s.top();
        s.pop();
        cout << node->data << " ";
        if (node->right) s.push(node->right);
        if (node->left) s.push(node->left);
    }
}

void postorderNonRecursive(Node* root) {
    if (!root) return;
    stack<Node*> s1, s2;
    s1.push(root);
    while (!s1.empty()) {
        Node* node = s1.top();
        s1.pop();
        s2.push(node);
        if (node->left) s1.push(node->left);
        if (node->right) s1.push(node->right);
    }
    while (!s2.empty()) {
        cout << s2.top()->data << " ";
        s2.pop();
    }
}

int main() {
    Node* root = nullptr;
    int choice, value;

    do {
        cout << "\n--- AVL Tree Menu ---\n";
        cout << "1. Insert Node\n";
        cout << "2. Recursive Inorder Traversal\n";
        cout << "3. Recursive Preorder Traversal\n";
        cout << "4. Recursive Postorder Traversal\n";
        cout << "5. Non-Recursive Inorder Traversal\n";
        cout << "6. Non-Recursive Preorder Traversal\n";
        cout << "7. Non-Recursive Postorder Traversal\n";
        cout << "8. Quit\n";
        cout << "Enter your choice: ";
        cin >> choice;

        switch (choice) {
            case 1:
                cout << "Enter value to insert: ";
                cin >> value;
                root = insert(root, value);
                break;
            case 2:
                cout << "Inorder (Recursive): ";
                inorderRecursive(root);
                cout << endl;
                break;
            case 3:
                cout << "Preorder (Recursive): ";
                preorderRecursive(root);
                cout << endl;
                break;
            case 4:
                cout << "Postorder (Recursive): ";
                postorderRecursive(root);
                cout << endl;
                break;
            case 5:
                cout << "Inorder (Non-Recursive): ";
                inorderNonRecursive(root);
                cout << endl;
                break;
            case 6:
                cout << "Preorder (Non-Recursive): ";
                preorderNonRecursive(root);
                cout << endl;
                break;
            case 7:
                cout << "Postorder (Non-Recursive): ";
                postorderNonRecursive(root);
                cout << endl;
                break;
            case 8:
                cout << "Exiting program...\n";
                break;
            default:
                cout << "Invalid choice! Try again.\n";
        }
    } while (choice != 8);

    return 0;
}