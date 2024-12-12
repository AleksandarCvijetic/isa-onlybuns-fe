<template>
    <div class="container">
      <h1>Registered Users</h1>
      <div class="filters">
        <input v-model="filters.name" placeholder="Search by name" />
        <input v-model="filters.email" placeholder="Search by email" />
        <input v-model.number="filters.minPosts" type="number" placeholder="Min posts" />
        <input v-model.number="filters.maxPosts" type="number" placeholder="Max posts" />
        <button @click="fetchUsers">Search</button>
      </div>
      <table>
        <thead>
          <tr>
            <th @click="sortBy('name')">Name <span :class="getSortIcon('name')"></span></th>
            <th @click="sortBy('email')">Email <span :class="getSortIcon('email')"></span></th>
            <th @click="sortBy('postCount')">Posts <span :class="getSortIcon('postCount')"></span></th>
            <th @click="sortBy('followingCount')">Following <span :class="getSortIcon('followingCount')"></span></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.id">
            <td>{{ user.name }}</td>
            <td>{{ user.email }}</td>
            <td>{{ user.postCount }}</td>
            <td>{{ user.followingCount }}</td>
          </tr>
        </tbody>
      </table>
      <div class="pagination">
        <button @click="prevPage" :disabled="page === 0">Previous</button>
        <span>Page {{ page + 1 }}</span>
        <button @click="nextPage">Next</button>
      </div>
    </div>
  </template>
  
  <script>
  import axios from "axios";
  
  export default {
    data() {
      return {
        users: [],
        filters: {
          name: "",
          email: "",
          minPosts: null,
          maxPosts: null,
        },
        page: 0,
        size: 5,
        sort: "name",
        sortOrder: 'asc', // To toggle sort order
      };
    },
    methods: {
      fetchUsers() {
        const params = { 
          ...this.filters, 
          page: this.page, 
          size: this.size, 
          sortBy: this.sort,
          sortOrder: this.sortOrder,
        };
        const token = localStorage.getItem("jwtToken"); // Replace with your token storage logic
        console.log("Request params:", params); // Debugging request parameters
  
        axios
          .get("http://localhost:8080/auth/admin/users", {
            params,
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((response) => {
            console.log("Response from API:", response.data); // Debugging API response
            this.users = response.data.content; // Assign users
            console.log("Users array:", this.users); // Confirm data in the `users` array
          })
          .catch((error) => {
            console.error("Error fetching users:", error); // Handle errors
          });
      },
      sortBy(field) {
        if (this.sort === field) {
          // Toggle sort order
          this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
        } else {
          this.sort = field;
          this.sortOrder = 'asc';
        }
        this.fetchUsers();
      },
      getSortIcon(field) {
        if (this.sort === field) {
          return this.sortOrder === 'asc' ? 'sort-asc' : 'sort-desc';
        }
        return '';
      },
      prevPage() {
        if (this.page > 0) {
          this.page -= 1;
          this.fetchUsers();
        }
      },
      nextPage() {
        this.page += 1;
        this.fetchUsers();
      },
    },
    mounted() {
      this.fetchUsers();
    },
  };
  </script>
  
  <style scoped>
  .container {
    max-width: 800px;
    margin: 40px auto;
    padding: 20px;
    background-color: #f9fafb;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
  
  h1 {
    text-align: center;
    color: #333;
    margin-bottom: 20px;
  }
  
  .filters {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 10px;
    margin-bottom: 20px;
  }
  
  .filters input {
    padding: 8px 12px;
    border: 1px solid #ddd;
    border-radius: 4px;
    width: 180px;
    transition: border-color 0.3s;
  }
  
  .filters input:focus {
    border-color: #3b82f6;
    outline: none;
  }
  
  .filters button {
    padding: 8px 16px;
    background-color: #3b82f6;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;
  }
  
  .filters button:hover {
    background-color: #2563eb;
  }
  
  table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 20px;
  }
  
  thead {
    background-color: #3b82f6;
    color: white;
  }
  
  th, td {
    padding: 12px 15px;
    text-align: left;
    border-bottom: 1px solid #ddd;
  }
  
  th {
    cursor: pointer;
    position: relative;
  }
  
  th span {
    margin-left: 8px;
    font-size: 12px;
  }
  
  .sort-asc::after {
    content: '▲';
    position: absolute;
    right: 10px;
    font-size: 10px;
  }
  
  .sort-desc::after {
    content: '▼';
    position: absolute;
    right: 10px;
    font-size: 10px;
  }
  
  tbody tr:hover {
    background-color: #f1f5f9;
  }
  
  .pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 15px;
  }
  
  .pagination button {
    padding: 8px 16px;
    background-color: #10b981;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;
  }
  
  .pagination button:disabled {
    background-color: #a5f3fc;
    cursor: not-allowed;
  }
  
  .pagination button:hover:not(:disabled) {
    background-color: #059669;
  }
  
  .pagination span {
    font-size: 16px;
    color: #555;
  }
  </style>
  