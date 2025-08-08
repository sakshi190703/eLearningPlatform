#include <iostream>
#include <stack>
using namespace std;
class Node {
public:
int data;
Node *left, *right;
bool lThread, rThread;
Node(int val) {
data = val;
left = right = nullptr;
lThread = rThread = true;
}
};
class ThreadedBinaryTree {
public:
Node *root;
ThreadedBinaryTree() { root = nullptr; }
void insert(int key) {
Node *ptr = root;
Node *par = nullptr;
while (ptr != nullptr) {
if (key == ptr->data) {
cout << "Duplicate keys not allowed!\n";
return;
}
par = ptr;
if (key < ptr->data) {
if (ptr->lThread) break;
ptr = ptr->left;
} else {
if (ptr->rThread) break;
ptr = ptr->right;
}
}
Node *newNode = new Node(key);
if (par == nullptr) {
root = newNode;
} else if (key < par->data) {
newNode->left = par->left;
newNode->right = par;
par->lThread = false;
par->left = newNode;
} else {
newNode->left = par;
newNode->right = par->right;
par->rThread = false;
par->right = newNode;
}
}
Node* leftmost(Node *node) {
while (node && !node->lThread)
node = node->left;
return node;
}
void inorderRecursive(Node *node) {
if (node == nullptr) return;
if (!node->lThread) inorderRecursive(node->left);
cout << node->data << " ";
if (!node->rThread) inorderRecursive(node->right);
}
void inorder() {
Node *cur = leftmost(root);
while (cur) {
cout << cur->data << " ";
if (cur->rThread)
cur = cur->right;
else
cur = leftmost(cur->right);
}
cout << endl;
}
void preorderRecursive(Node *node) {
if (node == nullptr) return;
cout << node->data << " ";
if (!node->lThread) preorderRecursive(node->left);
if (!node->rThread) preorderRecursive(node->right);
}
void preorder() {
Node *cur = root;
while (cur) {
cout << cur->data << " ";
if (!cur->lThread)
cur = cur->left;
else {
while (cur && cur->rThread)
cur = cur->right;
if (cur)
cur = cur->right;
}
}
cout << endl;
}
void postorderRecursive(Node *node) {
if (node == nullptr) return;
if (!node->lThread) postorderRecursive(node->left);
if (!node->rThread) postorderRecursive(node->right);
cout << node->data << " ";
}
void postorder() {
stack<Node*> s1, s2;
if (!root) return;
s1.push(root);
while (!s1.empty()) {
Node *cur = s1.top(); s1.pop();
s2.push(cur);
if (!cur->lThread) s1.push(cur->left);
if (!cur->rThread) s1.push(cur->right);
}
while (!s2.empty()) {
cout << s2.top()->data << " ";
s2.pop();
}
cout << endl;
}
};
int main() {
ThreadedBinaryTree tbt;
int n, value, choice;
cout << "Enter number of nodes: ";
cin >> n;
cout << "Enter values: ";
for (int i = 0; i < n; i++) {
cin >> value;
tbt.insert(value);
}
do {
cout << "\nChoose Traversal Type:\n";
cout << "1. Inorder (Non-Recursive)\n";
cout << "2. Inorder (Recursive)\n";
cout << "3. Preorder (Non-Recursive)\n";
cout << "4. Preorder (Recursive)\n";
cout << "5. Postorder (Recursive)\n";
cout << "6. Postorder (Non-Recursive)\n";
cout << "7. Exit\n";
cout << "Enter your choice: ";
cin >> choice;
switch (choice) {
case 1:
cout << "Inorder Traversal (Non-Recursive): ";
tbt.inorder();
break;
case 2:
cout << "Inorder Traversal (Recursive): ";
tbt.inorderRecursive(tbt.root);
cout << endl;
break;
case 3:
cout << "Preorder Traversal (Non-Recursive): ";
tbt.preorder();
break;
case 4:
cout << "Preorder Traversal (Recursive): ";
tbt.preorderRecursive(tbt.root);
cout << endl;
break;
case 5:
cout << "Postorder Traversal (Recursive): ";
tbt.postorderRecursive(tbt.root);
cout << endl;
break;
case 6:
cout << "Postorder Traversal (Non-Recursive): ";
tbt.postorder();
break;
case 7:
cout << "Exiting...\n";
break;
default:
cout << "Invalid choice! Try again.\n";
}
} while (choice != 7);
return 0;
}