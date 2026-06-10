# Graph Analyzer REST API

A minimalist Express.js application to process graph edges, build hierarchies, detect cycles, and visualize them.

## 🚀 Deployment

This project is configured for deployment on **Vercel** and **Render.com**.
- `vercel.json`: Configuration for Vercel deployment.
- `render.yaml`: Configuration for Render Blueprint deployment.

## 🛠️ Local Setup

1. **Clone the repository**
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Run the server**:
   ```bash
   npm start
   ```
   The server will run on `http://localhost:3000`.

4. **Access the Frontend**:
   Open `http://localhost:3000` in your browser to use the Graph Explorer UI.

## 📡 API Documentation

### **POST /api/graph**

Processes a list of edges and returns graph hierarchies.

#### **Request Format**
- **Method**: `POST`
- **Headers**: `Content-Type: application/json`
- **Body**:
  ```json
  {
    "edges": ["A->B", "A->C", "B->D"]
  }
  ```

#### **Response Format (200 OK)**
```json
{
  "user_id": "your_user_id",
  "email_id": "your_email@example.com",
  "enrollment_number": "your_enrollment_number",
  "hierarchies": [
    {
      "root": "A",
      "tree": {
        "A": {
          "B": { "D": {} },
          "C": {}
        }
      },
      "depth": 3
    }
  ],
  "invalid_entries": [],
  "duplicate_edges": [],
  "summary": {
    "total_trees": 1,
    "total_cycles": 0,
    "largest_tree_root": "A"
  }
}
```

#### **Error Response (400 Bad Request)**
```json
{
  "error": "missing -> edges array required"
}
```

## 🧪 Testing

Run the included edge-case test suite:
```bash
node test.js
```

## 🏗️ Project Structure
- `src/index.js`: Entry point & static file serving.
- `src/routes/graph.js`: API route handler.
- `src/logic/processGraph.js`: Core graph processing logic.
- `public/index.html`: Minimalist frontend UI.
