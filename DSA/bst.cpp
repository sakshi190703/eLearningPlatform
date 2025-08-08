#include <iostream>
#include <queue>
#include <stack>
using namespace std;

struct Node {
    int data;
    Node* left;
    Node* right;

    Node(int value) {
        data = value;
        left = right = nullptr;
    }
};

// Insert a node in BST
Node* insert(Node* root, int value) {
    if (root == nullptr)
        return new Node(value);

    if (value < root->data)
        root->left = insert(root->left, value);
    else if (value > root->data)
        root->right = insert(root->right, value);

    return root;
}

// Find minimum node in BST
Node* findMin(Node* root) {
    while (root && root->left)
        root = root->left;
    return root;
}

// Delete a node in BST
Node* deleteNode(Node* root, int key) {
    if (!root) return nullptr;

    if (key < root->data)
        root->left = deleteNode(root->left, key);
    else if (key > root->data)
        root->right = deleteNode(root->right, key);
    else {
        // Node with one child or no child
        if (!root->left) {
            Node* temp = root->right;
            delete root;
            return temp;
        }
        else if (!root->right) {
            Node* temp = root->left;
            delete root;
            return temp;
        }

        // Node with two children
        Node* temp = findMin(root->right);
        root->data = temp->data;
        root->right = deleteNode(root->right, temp->data);
    }

    return root;
}

// Recursive Inorder Traversal
void inorderRecursive(Node* root) {
    if (root) {
        inorderRecursive(root->left);
        cout << root->data << " ";
        inorderRecursive(root->right);
    }
}

// Recursive Preorder Traversal
void preorderRecursive(Node* root) {
    if (root) {
        cout << root->data << " ";
        preorderRecursive(root->left);
        preorderRecursive(root->right);
    }
}

// Recursive Postorder Traversal
void postorderRecursive(Node* root) {
    if (root) {
        postorderRecursive(root->left);
        postorderRecursive(root->right);
        cout << root->data << " ";
    }
}

// Non-Recursive Inorder Traversal
void inorderNonRecursive(Node* root) {
    stack<Node*> s;
    Node* curr = root;
    while (curr || !s.empty()) {
        while (curr) {
            s.push(curr);
            curr = curr->left;
        }
        curr = s.top();
        s.pop();
        cout << curr->data << " ";
        curr = curr->right;
    }
}

// Non-Recursive Preorder Traversal
void preorderNonRecursive(Node* root) {
    if (!root) return;
    stack<Node*> s;
    s.push(root);
    while (!s.empty()) {
        Node* curr = s.top();
        s.pop();
        cout << curr->data << " ";

        if (curr->right) s.push(curr->right);
        if (curr->left) s.push(curr->left);
    }
}

// Non-Recursive Postorder Traversal
void postorderNonRecursive(Node* root) {
    if (!root) return;
    stack<Node*> s1, s2;
    s1.push(root);
    while (!s1.empty()) {
        Node* curr = s1.top();
        s1.pop();
        s2.push(curr);
        if (curr->left) s1.push(curr->left);
        if (curr->right) s1.push(curr->right);
    }
    while (!s2.empty()) {
        cout << s2.top()->data << " ";
        s2.pop();
    }
}

// Level Order Traversal
void levelOrderTraversal(Node* root) {
    if (!root) return;
    queue<Node*> q;
    q.push(root);
    while (!q.empty()) {
        Node* curr = q.front();
        q.pop();
        cout << curr->data << " ";
        if (curr->left) q.push(curr->left);
        if (curr->right) q.push(curr->right);
    }
}

// Menu-driven interface
int main() {
    Node* root = nullptr;
    int choice, val;

    do {
        cout << "\nBinary Search Tree Operations:\n";
        cout << "1. Insert\n2. Delete\n3. Inorder (Recursive)\n4. Preorder (Recursive)\n5. Postorder (Recursive)\n";
        cout << "6. Inorder (Non-Recursive)\n7. Preorder (Non-Recursive)\n8. Postorder (Non-Recursive)\n";
        cout << "9. Level Order Traversal\n0. Exit\nEnter your choice: ";
        cin >> choice;

        switch (choice) {
        case 1:
            cout << "Enter value to insert: ";
            cin >> val;
            root = insert(root, val);
            break;
        case 2:
            cout << "Enter value to delete: ";
            cin >> val;
            root = deleteNode(root, val);
            break;
        case 3:
            cout << "Inorder (Recursive): ";
            inorderRecursive(root);
            cout << endl;
            break;
        case 4:
            cout << "Preorder (Recursive): ";
            preorderRecursive(root);
            cout << endl;
            break;
        case 5:
            cout << "Postorder (Recursive): ";
            postorderRecursive(root);
            cout << endl;
            break;
        case 6:
            cout << "Inorder (Non-Recursive): ";
            inorderNonRecursive(root);
            cout << endl;
            break;
        case 7:
            cout << "Preorder (Non-Recursive): ";
            preorderNonRecursive(root);
            cout << endl;
            break;
        case 8:
            cout << "Postorder (Non-Recursive): ";
            postorderNonRecursive(root);
            cout << endl;
            break;
        case 9:
            cout << "Level Order Traversal: ";
            levelOrderTraversal(root);
            cout << endl;
            break;
        case 0:
            cout << "Exiting.\n";
            break;
        default:
            cout << "Invalid choice!\n";
        }
    } while (choice != 0);

    return 0;
}
