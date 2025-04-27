<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Weather Search History</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 20px;
            background-color: #f7f7f7;
            font-size: 14px;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
        }
        h1 {
            font-size: 24px;
            color: #333;
            margin-bottom: 20px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
            background: white;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        th, td {
            padding: 12px;
            text-align: left;
            border-bottom: 1px solid #ddd;
        }
        th {
            background-color: #f2f2f2;
            font-weight: bold;
        }
        tr:hover {
            background-color: #f5f5f5;
        }
        .back-btn {
            display: inline-block;
            padding: 8px 16px;
            background-color: #007bff;
            color: white;
            text-decoration: none;
            border-radius: 4px;
            margin-top: 15px;
        }
        .back-btn:hover {
            background-color: #0056b3;
        }
        .action-link {
            color: #007bff;
            text-decoration: none;
            margin-right: 10px;
        }
        .action-link:hover {
            text-decoration: underline;
        }
        .delete-btn {
            color: #dc3545;
            background: none;
            border: none;
            padding: 0;
            cursor: pointer;
        }
        .delete-btn:hover {
            text-decoration: underline;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Weather Search History</h1>

        <% if (history && history.length > 0) { %>
            <table>
                <thead>
                    <tr>
                        <th>Location</th>
                        <th>Date</th>
                        <th>Temperature</th>
                        <th>Condition</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <% history.forEach(record => { %>
                        <tr>
                            <td><%= record.city || record.zip %></td>
                            <td><%= record.date %></td>
                            <td><%= record.temp_c %>°C</td>
                            <td>
                                <% if (record.condition.includes('Sunny')) { %>
                                    ☀️
                                <% } else if (record.condition.includes('Rain')) { %>
                                    🌧️
                                <% } else if (record.condition.includes('Cloud')) { %>
                                    ☁️
                                <% } %>
                                <%= record.condition %>
                            </td>
                            <td>
                                <a href="/history/edit/<%= record.recordId %>" class="action-link">✏️ Edit</a>
                                <form action="/history/delete/<%= record.recordId %>" method="POST" style="display: inline;">
                                    <button type="submit" class="delete-btn">🗑️ Delete</button>
                                </form>
                            </td>
                        </tr>
                    <% }) %>
                </tbody>
            </table>
        <% } else { %>
            <p>No weather search history available.</p>
        <% } %>

        <a href="/" class="back-btn">← Back to Search</a>
    </div>
</body>
</html>
