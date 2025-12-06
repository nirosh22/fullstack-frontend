<template>
    <div>
        <h1>Available Lessons</h1>

        <!-- Sorting Controls -->
        <div class="sort-controls">
            <label>Sort by:</label>
            <select v-model="sortKey" @change="sortLessons">
                <option disabled value="">Select</option>
                <option value="subject">Subject</option>
                <option value="location">Location</option>
                <option value="price">Price</option>
                <option value="spaces">Spaces</option>
            </select>

            <button @click="toggleSortOrder">
                Sort: {{ sortOrder === 'asc' ? 'Ascending' : 'Descending' }}
            </button>
        </div>

        <!-- Lessons List -->
        <div v-if="loading">Loading lessons...</div>
        <div v-else-if="lessons.length === 0">No lessons found.</div>

        <ul v-else>
            <li v-for="lesson in lessons" :key="lesson._id" class="lesson-item">
                <font-awesome-icon :icon="getIcon(lesson.subject)" />
                {{ lesson.subject }} — {{ lesson.location }} — £{{ lesson.price }} —
                {{ lesson.spaces }} spaces

                <button @click="addToCart(lesson)"
                        :disabled="lesson.spaces === 0"
                        class="add-btn">
                    Add to Cart
                </button>
            </li>
        </ul>

        <!-- 🛒 Shopping Cart -->
        <div v-if="cart.length > 0" class="cart">
            <h2>Shopping Cart</h2>
            <ul>
                <li v-for="(item, index) in cart" :key="index">
                    {{ item.subject }} — {{ item.location }} — £{{ item.price }}
                    <button @click="removeFromCart(index)">Remove</button>
                </li>
            </ul>

            <!-- ✅ Checkout Form -->
            <h3>Checkout</h3>
            <div class="checkout-form">
                <input v-model="name" type="text" placeholder="Enter your name" />
                <input v-model="phone" type="text" placeholder="Enter your phone" />

                <button @click="checkout"
                        :disabled="!isValidCheckout"
                        class="checkout-btn">
                    Checkout
                </button>

                <p v-if="message" class="confirmation">{{ message }}</p>
            </div>
        </div>
    </div>
</template>

<script>
    const API_BASE = "https://fullstack-backend-hzik.onrender.com";

    export default {
        name: "App",
        data() {
            return {
                lessons: [],
                loading: true,
                sortKey: "",
                sortOrder: "asc",
                cart: [],
                name: "",
                phone: "",
                message: ""
            };
        },
        computed: {
            isValidCheckout() {
                const nameValid = /^[A-Za-z\s]+$/.test(this.name);
                const phoneValid = /^[0-9]+$/.test(this.phone);
                return nameValid && phoneValid && this.cart.length > 0;
            }
        },
        async created() {
            try {
                const res = await fetch(`${API_BASE}/lessons`);
                this.lessons = await res.json();
            } catch (err) {
                console.error("Error fetching lessons:", err);
            } finally {
                this.loading = false;
            }
        },
        methods: {
            getIcon(subject) {
                const icons = {
                    Football: "futbol",
                    Basketball: "basketball-ball",
                    Tennis: "table-tennis-paddle-ball",
                    Swimming: "person-swimming",
                    "Martial Arts": "dumbbell",
                    Cricket: "baseball-bat-ball",
                    Rugby: "futbol",
                    Athletics: "running",
                    Volleyball: "volleyball-ball",
                    Badminton: "table-tennis-paddle-ball",
                };
                return icons[subject] || "futbol";
            },

            sortLessons() {
                if (!this.sortKey) return;
                this.lessons.sort((a, b) => {
                    const valA = a[this.sortKey];
                    const valB = b[this.sortKey];
                    if (typeof valA === "string") {
                        return this.sortOrder === "asc"
                            ? valA.localeCompare(valB)
                            : valB.localeCompare(valA);
                    } else {
                        return this.sortOrder === "asc" ? valA - valB : valB - valA;
                    }
                });
            },

            toggleSortOrder() {
                this.sortOrder = this.sortOrder === "asc" ? "desc" : "asc";
                this.sortLessons();
            },

            addToCart(lesson) {
                if (lesson.spaces > 0) {
                    this.cart.push(lesson);
                    lesson.spaces--;
                }
            },

            removeFromCart(index) {
                const removed = this.cart.splice(index, 1)[0];
                const lesson = this.lessons.find(l => l._id === removed._id);
                if (lesson) lesson.spaces++;
            },

            async checkout() {
                if (!this.isValidCheckout) return;

                const order = {
                    name: this.name,
                    phone: this.phone,
                    lessonIDs: this.cart.map(item => item._id)
                };

                try {
                    // Save order to DB
                    const res = await fetch(`${API_BASE}/orders`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(order)
                    });

                    if (res.ok) {
                        // Update spaces for each lesson
                        for (const item of this.cart) {
                            await fetch(`${API_BASE}/lessons/${item._id}`, {
                                method: "PUT",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ spaces: item.spaces })
                            });
                        }

                        this.message = "✅ Order saved to database!";
                        this.cart = [];
                        this.name = "";
                        this.phone = "";
                    } else {
                        this.message = "❌ Error saving order.";
                    }
                } catch (err) {
                    console.error("Error during checkout:", err);
                    this.message = "❌ Server error during checkout.";
                }
            }
        }
    };
</script>

<style>
    body {
        font-family: Arial, sans-serif;
        margin: 20px;
    }

    .sort-controls {
        margin-bottom: 20px;
    }

    .lesson-item {
        margin-bottom: 10px;
    }

    .add-btn {
        margin-left: 10px;
        padding: 4px 8px;
        background-color: #28a745;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
    }

        .add-btn:disabled {
            background-color: gray;
            cursor: not-allowed;
        }

    .cart {
        margin-top: 30px;
        padding: 15px;
        border-top: 2px solid #ccc;
    }

    .checkout-form {
        margin-top: 20px;
    }

        .checkout-form input {
            margin-right: 10px;
            padding: 5px;
        }

    .checkout-btn {
        background-color: #007bff;
        color: white;
        border: none;
        padding: 5px 10px;
        border-radius: 4px;
        cursor: pointer;
    }

        .checkout-btn:disabled {
            background-color: gray;
            cursor: not-allowed;
        }

    .confirmation {
        color: green;
        margin-top: 10px;
    }
</style>

