#include<iostream>
#include<cstdlib>
#include<ctime>
#include<fstream>

using namespace std;

const int MAX_ROWS = 21;
const int MAX_COLS = 41;

void clearScreen();
void generateMaze(int rows, int cols, char maze[][MAX_COLS + 1]);
void writeMazeToFile(const char *filename, int rows, int cols,
                     char maze[][MAX_COLS + 1]);
void readMazeFromFile(const char *filename, int rows, int cols,
                      char maze[][MAX_COLS + 1]);
void displayMaze(int rows, int cols, char maze[][MAX_COLS + 1]);

int main() {
  srand(time(0));

  ofstream logFile("errors.txt", ios::app);

  int rows, cols;
  string difficulty;

  cout << "Select maze difficulty level (easy, normal, hard)= ";
  try {
    cin >> difficulty;
    if (cin.fail()) {
      logFile << "Input Error: Failed to read difficulty level.\n";
      throw "Input Error!";
    }
  } catch (const char *msg) {
    cout << msg << "\n";
    logFile << msg << "\n";
    logFile.close();
    return 1;
  }

  if (difficulty == "easy" || difficulty == "Easy") {
    rows = 11;
    cols = 21;
  } else if (difficulty == "normal" || difficulty == "Normal") {
    rows = 15;
    cols = 31;
  } else if (difficulty == "hard" || difficulty == "Hard") {
    rows = 21;
    cols = 41;
  } else {
    cout << "Invalid Difficulty Level...\n";
    logFile << "Error: Invalid difficulty entered: " << difficulty << "\n";
    logFile.close();
    return 1;
  }

  char maze[MAX_ROWS][MAX_COLS + 1];

  char loadChoice;
  cout << "Load maze from file (Y/N)? ";
  cin >> loadChoice;

  const char *filename;
  if (difficulty == "easy" || difficulty == "Easy") {
    filename = "mazeEasy.txt";
  } else if (difficulty == "normal" || difficulty == "Normal") {
    filename = "mazeNormal.txt";
  } else {
    filename = "mazeHard.txt";
  }

  if (loadChoice == 'Y' || loadChoice == 'y') {
    readMazeFromFile(filename, rows, cols, maze);
    logFile << "Maze loaded from file: " << filename << "\n";
  } else {
    generateMaze(rows, cols, maze);
    writeMazeToFile(filename, rows, cols, maze);
    logFile << "Maze generated and saved to file: " << filename << "\n";
  }

  int playerRow = 1, playerCol = 1;
  maze[playerRow][playerCol] = '^';

  bool gameOver = false;
  char input;
  int attempts = 3;

  clearScreen();
  displayMaze(rows, cols, maze);
  cout << "Note: Arrow keys may not work. Please use W/A/S/D only.\n";

  while (!gameOver) {
    cout << "Make Your Move (W/A/S/D)= ";
    try {
      cin >> input;
      if (cin.fail()) {
        logFile << "Input Error: Failed to read movement input.\n";
        throw "Input Error!";
      }
    } catch (const char *msg) {
      cout << msg << "\n";
      cin.clear();
      cin.ignore(1000, '\n');
      continue;
    }

    if (input >= 'a' && input <= 'z') {
      input = input - 'a' + 'A';
    }

    int newRow = playerRow;
    int newCol = playerCol;

    if (input == 'W')
      newRow--;
    else if (input == 'A')
      newCol--;
    else if (input == 'S')
      newRow++;
    else if (input == 'D')
      newCol++;
    else {
      cout << "Invalid input. Please use W, A, S, D.\n";
      logFile << "Invalid key pressed: " << input << "\n";
      continue;
    }

    if (newRow < 0 || newRow >= rows || newCol < 0 || newCol >= cols) {
      cout << "Invalid move...Try Another Move.\n";
      logFile << "Invalid move attempt to out-of-bounds (" << newRow << ","
              << newCol << ")\n";
      continue;
    }

    if (maze[newRow][newCol] == '#') {
      attempts--;
      cout << "Invalid move...Hit a wall! Remaining attempts: " << attempts
           << "\n";
      logFile << "Wall hit at (" << newRow << "," << newCol
              << "). Attempts left: " << attempts << "\n";
      if (attempts == 0) {
        cout << "Game Over!...You Hit The Wall More Than 3 Times.\n";
        logFile << "Game over due to 3 wall hits.\n";
        gameOver = true;
      }
      continue;
    }

    maze[playerRow][playerCol] = ' ';
    playerRow = newRow;
    playerCol = newCol;

    if (maze[playerRow][playerCol] == 'E') {
      maze[playerRow][playerCol] = '^';
      clearScreen();
      displayMaze(rows, cols, maze);
      cout << "Congratulations! You Have Reached The End.\n";
      logFile << "Player reached the end successfully.\n";
      gameOver = true;
    } else {
      maze[playerRow][playerCol] = '^';
    }

    clearScreen();
    displayMaze(rows, cols, maze);
  }

  logFile.close();
  return 0;
}

void clearScreen() {
  for (int i = 0; i < 50; i++) {
    cout << "\n";
  }
}

void generateMaze(int rows, int cols, char maze[][MAX_COLS + 1]) {
  for (int i = 0; i < rows; i++) {
    for (int j = 0; j < cols; j++) {
      maze[i][j] = '#';
    }
    maze[i][cols] = '\0';
  }

  int curRow = 1, curCol = 1;
  maze[curRow][curCol] = ' ';
  while (curRow < rows - 2 || curCol < cols - 2) {
    bool canMoveRight = (curCol < cols - 2);
    bool canMoveDown = (curRow < rows - 2);
    int direction = 0;
    if (canMoveRight && canMoveDown)
      direction = rand() % 2;
    else if (canMoveRight)
      direction = 0;
    else if (canMoveDown)
      direction = 1;

    if (direction == 0)
      curCol++;
    else
      curRow++;

    maze[curRow][curCol] = ' ';
  }

  maze[rows - 2][cols - 2] = 'E';

  for (int i = 1; i < rows - 1; i++) {
    for (int j = 1; j < cols - 1; j++) {
      if (maze[i][j] == '#' && (rand() % 100) < 20) {
        maze[i][j] = ' ';
      }
    }
  }
}

void writeMazeToFile(const char *filename, int rows, int cols,
                     char maze[][MAX_COLS + 1]) {
  ofstream file;
  file.open(filename);
  if (file.is_open()) {
    for (int i = 0; i < rows; i++) {
      file << maze[i] << "\n";
    }
    file.close();
  } else {
    cout << "Error!...Could Not Open File For Writing.\n";
  }
}

void readMazeFromFile(const char *filename, int rows, int cols,
                      char maze[][MAX_COLS + 1]) {
  ifstream file(filename);
  if (file.is_open()) {
    for (int i = 0; i < rows; i++) {
      file.getline(maze[i], MAX_COLS + 1);
    }
    file.close();
    cout << "Maze loaded from file.\n";
  } else {
    cout << "Could not open file. Generating new maze instead.\n";
    generateMaze(rows, cols, maze);
    writeMazeToFile(filename, rows, cols, maze);
  }
}

void displayMaze(int rows, int cols, char maze[][MAX_COLS + 1]) {
  for (int i = 0; i < rows; i++) {
    cout << maze[i] << "\n";
  }
}
