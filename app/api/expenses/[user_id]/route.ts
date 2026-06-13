import { pool } from '@db/db';
import { GET } from '../route';
/**
 * SAVE FUNCTION
 * gets old data through api request
 * gets new data through front end upon save button click
 * compares the two tables, keeping track of the changes
 *      saves each newly created expense into "inserted" array
 *      saves each newly updated expense into "updated" array
 *      saves THE ID of each newly deleted expense into "deleted" array
 * converts each array into SQL queries, then runs them INDIVIDUALLY*
 *      current implementation causes multiple queries, improvement can be made
 *      to batch them into singular/fewer queries
 */

let testDataOld; // data on the bottom
let testDataNew;

/**
ID 2 updated (Groceries amount changed)
ID 4 deleted
ID 6 inserted
ID 5 updated (label changed)
 */

export async function save(request: Request, { params }) {
    // get old data
    const userId = params.user_id;
    const oldExpenses = await GET(userId);

    // convert to maps for comparison
    // searching with key in map is constant time vs linear array search
    const oldMap = new Map(testDataOld.map(e => [e.id, e]));
    const newMap = new Map(testDataNew.map(e => [e.id, e]));

    // generate arrays of modified expenses through comparison
    let inserts = [];
    let updates = [];
    let deletes = [];

    for (const [id, expense] of newMap) { // inserts
        if (!oldMap.has(id)) {
            inserts.push(expense);
        }
    }
    for (const [id, newExpense] of newMap) { // updates
        const oldExpense = oldMap.get(id);
        if (oldExpense && oldExpense !== newExpense) {
            updates.push(newExpense);
        }
    }
    for (const [id, expense] of oldMap) { // deletes
        if (!newMap.has(id)) {
            deletes.push(expense);
        }
    }
    // generate SQL using modified expenses

    // send queries to database INDIVIDUALLY* 
}

testDataOld = [
  {
    "id": 1,
    "user_id": 1,
    "label": "Rent",
    "amount": 1200.00,
    "month": 6,
    "year": 2026
  },
  {
    "id": 2,
    "user_id": 1,
    "label": "Groceries",
    "amount": 350.00,
    "month": 6,
    "year": 2026
  },
  {
    "id": 3,
    "user_id": 1,
    "label": "Internet",
    "amount": 60.00,
    "month": 6,
    "year": 2026
  },
  {
    "id": 4,
    "user_id": 1,
    "label": "Gas",
    "amount": 100.00,
    "month": 6,
    "year": 2026
  },
  {
    "id": 5,
    "user_id": 1,
    "label": "Gym",
    "amount": 40.00,
    "month": 6,
    "year": 2026
  }
];
testDataNew = [
  {
    "id": 1,
    "user_id": 1,
    "label": "Rent",
    "amount": 1200.00,
    "month": 6,
    "year": 2026
  },
  {
    "id": 2,
    "user_id": 1,
    "label": "Groceries",
    "amount": 425.00,
    "month": 6,
    "year": 2026
  },
  {
    "id": 3,
    "user_id": 1,
    "label": "Internet",
    "amount": 60.00,
    "month": 6,
    "year": 2026
  },
  {
    "id": 5,
    "user_id": 1,
    "label": "Fitness Membership",
    "amount": 40.00,
    "month": 6,
    "year": 2026
  },
  {
    "id": 6,
    "user_id": 1,
    "label": "Streaming",
    "amount": 15.99,
    "month": 6,
    "year": 2026
  }
];