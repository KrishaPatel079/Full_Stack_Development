const mongoose = require('mongoose');
const Question = require('./models/Question');
require('dotenv').config();

// Sample questions data
const sampleQuestions = [
  {
    title: "Two Sum",
    questionText: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice.",
    category: "Arrays",
    difficulty: "Easy",
    answer: "Use a hash map to store complements",
    explanation: "We can solve this in O(n) time by using a hash map. For each number, we check if its complement (target - number) exists in the map. If it does, we've found our pair.",
    testCases: [
      {
        input: "nums = [2,7,11,15], target = 9",
        output: "[0,1]",
        description: "2 + 7 = 9, so return [0,1]"
      },
      {
        input: "nums = [3,2,4], target = 6",
        output: "[1,2]",
        description: "2 + 4 = 6, so return [1,2]"
      }
    ],
    constraints: "2 <= nums.length <= 10^4, -10^9 <= nums[i] <= 10^9, -10^9 <= target <= 10^9",
    hints: ["Try using a hash map", "Think about what you need to find for each number"],
    tags: ["hash-table", "array", "two-pointers"],
    points: 10
  },
  {
    title: "Valid Parentheses",
    questionText: "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid. An input string is valid if: Open brackets must be closed by the same type of brackets. Open brackets must be closed in the correct order.",
    category: "Strings",
    difficulty: "Easy",
    answer: "Use a stack to track opening brackets",
    explanation: "We can use a stack to keep track of opening brackets. When we encounter a closing bracket, we check if it matches the most recent opening bracket.",
    testCases: [
      {
        input: "s = \"()\"",
        output: "true",
        description: "Simple valid parentheses"
      },
      {
        input: "s = \"([)]\"",
        output: "false",
        description: "Invalid order of brackets"
      }
    ],
    constraints: "1 <= s.length <= 10^4, s consists of parentheses only '()[]{}'",
    hints: ["Use a stack data structure", "Check for matching brackets"],
    tags: ["stack", "string"],
    points: 10
  },
  {
    title: "Reverse Linked List",
    questionText: "Given the head of a singly linked list, reverse the list, and return the reversed list.",
    category: "Linked Lists",
    difficulty: "Easy",
    answer: "Use three pointers to reverse links",
    explanation: "We can reverse a linked list by iteratively changing the next pointer of each node to point to the previous node. We need three pointers: previous, current, and next.",
    testCases: [
      {
        input: "head = [1,2,3,4,5]",
        output: "[5,4,3,2,1]",
        description: "Reverse the linked list"
      }
    ],
    constraints: "The number of nodes in the list is in the range [0, 5000], -5000 <= Node.val <= 5000",
    hints: ["Use three pointers", "Change next pointers one by one"],
    tags: ["linked-list", "recursion"],
    points: 10
  }
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/interviewprepai');
    console.log('✅ Connected to MongoDB');

    // Clear existing questions
    await Question.deleteMany({});
    console.log('🗑️ Cleared existing questions');

    // Insert sample questions
    const questions = await Question.insertMany(sampleQuestions);
    console.log(`✅ Inserted ${questions.length} sample questions`);

    // Set one question as daily
    if (questions.length > 0) {
      await questions[0].setAsDailyQuestion(new Date());
      console.log('📅 Set first question as daily question');
    }

    console.log('🎉 Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

// Run the seed function
seedDatabase();
