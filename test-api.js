const app = require('./server');

const PORT = 3001;
let server;

const BASE_URL = `http://localhost:${PORT}/api/books`;

async function runTests() {
  server = app.listen(PORT);
  console.log(`\n--- Starting API Tests on ${BASE_URL} ---\n`);

  try {
    console.log('1. [TEST] GET /api/books (Fetch all books)');
    let res = await fetch(BASE_URL);
    let data = await res.json();
    console.log(`   Status: ${res.status}`);
    console.log(`   Initial count: ${data.count}`);
    if (res.status !== 200 || !data.success) throw new Error('GET /api/books failed');
    console.log('   ✓ PASS\n');

    console.log('2. [TEST] POST /api/books (Create a new book)');
    const newBookPayload = {
      title: 'Clean Code',
      author: 'Robert C. Martin',
      genre: 'Software Engineering',
      year: 2008
    };
    res = await fetch(BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newBookPayload)
    });
    data = await res.json();
    console.log(`   Status: ${res.status}`);
    console.log(`   Created Book:`, data.data);
    if (res.status !== 201 || !data.success) throw new Error('POST /api/books failed');
    const createdId = data.data.id;
    console.log('   ✓ PASS\n');

    console.log(`3. [TEST] GET /api/books/${createdId} (Fetch book by ID)`);
    res = await fetch(`${BASE_URL}/${createdId}`);
    data = await res.json();
    console.log(`   Status: ${res.status}`);
    console.log(`   Fetched Book:`, data.data);
    if (res.status !== 200 || data.data.id !== createdId) throw new Error(`GET /api/books/${createdId} failed`);
    console.log('   ✓ PASS\n');

    console.log(`4. [TEST] PUT /api/books/${createdId} (Update book details)`);
    const updatePayload = {
      genre: 'Programming Principles',
      year: 2009
    };
    res = await fetch(`${BASE_URL}/${createdId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatePayload)
    });
    data = await res.json();
    console.log(`   Status: ${res.status}`);
    console.log(`   Updated Book:`, data.data);
    if (res.status !== 200 || data.data.genre !== 'Programming Principles') throw new Error(`PUT /api/books/${createdId} failed`);
    console.log('   ✓ PASS\n');

    console.log(`5. [TEST] DELETE /api/books/${createdId} (Delete book by ID)`);
    res = await fetch(`${BASE_URL}/${createdId}`, {
      method: 'DELETE'
    });
    data = await res.json();
    console.log(`   Status: ${res.status}`);
    console.log(`   Deleted Book:`, data.data);
    if (res.status !== 200 || !data.success) throw new Error(`DELETE /api/books/${createdId} failed`);
    console.log('   ✓ PASS\n');

    console.log(`6. [TEST] GET /api/books/${createdId} (Verify deleted book returns 404)`);
    res = await fetch(`${BASE_URL}/${createdId}`);
    data = await res.json();
    console.log(`   Status: ${res.status}`);
    console.log(`   Response Message:`, data.message);
    if (res.status !== 404) throw new Error('Expected 404 Not Found');
    console.log('   ✓ PASS\n');

    console.log('7. [TEST] POST /api/books (Missing title - Expect 400 Bad Request)');
    res = await fetch(BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ author: 'Anonymous' })
    });
    data = await res.json();
    console.log(`   Status: ${res.status}`);
    console.log(`   Error Message:`, data.message);
    if (res.status !== 400) throw new Error('Expected 400 Bad Request');
    console.log('   ✓ PASS\n');

    console.log('=========================================');
    console.log(' ALL 7 CRUD API TESTS PASSED SUCCESSFULLY! ');
    console.log('=========================================\n');
  } catch (err) {
    console.error('Test Suite Failed:', err);
    process.exitCode = 1;
  } finally {
    server.close();
  }
}

runTests();
