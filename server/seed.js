import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Notice from './models/Notice.js';
import Event from './models/Event.js';
import User from './models/User.js';
import Product from './models/Product.js';

dotenv.config();

const notices = [
    {
        title: "End Semester Examination Schedule Released",
        category: "Exams",
        date: new Date("2024-12-12"),
        summary: "The final confirmed schedule for the Spring 2024 End Semester Examinations has been published.",
        important: true,
    },
    {
        title: "Hostel Fee Payment Deadline Extended",
        category: "Hostel",
        date: new Date("2024-12-10"),
        summary: "Due to server maintenance, the deadline for hostel fee payment has been extended by 3 days.",
        important: false,
    },
    {
        title: "Guest Lecture on Generative AI",
        category: "Academics",
        date: new Date("2024-12-15"),
        summary: "Dr. Smith from Stanford will use delivering a lecture on the future of LLMs in the main auditorium.",
        important: true,
    },
    {
        title: "Campus Wi-Fi Maintenance",
        category: "General",
        date: new Date("2024-12-11"),
        summary: "Wi-Fi services will be intermittent on Sunday from 2 AM to 6 AM for upgrades.",
        important: false,
    }
];

// Helper to get a date relative to now
const getFutureDate = (days) => {
    const d = new Date();
    d.setDate(d.getDate() + days);
    return d;
};

const events = [
    {
        title: "TechFest 2025: Innovation Summit",
        date: getFutureDate(7), // 7 days from now
        time: "10:00 AM",
        location: "Main Auditorium",
        description: "The annual technology festival featuring hackathons, robotics competitions, and keynote speakers.",
        category: "Festival",
        organizer: "Student Council",
    },
    {
        title: "Inter-Hostel Cricket Tournament",
        date: getFutureDate(3), // 3 days from now
        time: "02:00 PM",
        location: "University Sports Ground",
        description: "Cheer for your hostel team in the finals of the cricket championship.",
        category: "Sports",
        organizer: "Sports Committee",
    },
    {
        title: "Career Fair: Meet Top Recruiters",
        date: getFutureDate(14), // 2 weeks from now
        time: "09:00 AM",
        location: "Convention Center",
        description: "Opportunity for final year students to network with companies like Google, Microsoft, and Amazon.",
        category: "Career",
        organizer: "Placement Cell",
    }
];

const users = [
    {
        name: "John Student",
        email: "student@campus.edu",
        password: "password123",
        role: "Student",
        department: "Computer Science"
    },
    {
        name: "Dr. Faculty",
        email: "faculty@campus.edu",
        password: "password123",
        role: "Faculty",
        department: "Computer Science"
    },
    {
        name: "Admin User",
        email: "admin@campus.edu",
        password: "adminpassword",
        role: "Admin"
    }
];

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/campusquery')
    .then(async () => {
        console.log('✅ Connected to MongoDB for Seeding');

        await Notice.deleteMany({});
        await Event.deleteMany({});
        await User.deleteMany({});
        await Product.deleteMany({});
        console.log('🗑️  Cleared existing data');

        await Notice.insertMany(notices);
        await Event.insertMany(events);

        let createdUsers = [];
        for (const user of users) {
            try {
                const u = await User.create(user);
                createdUsers.push(u);
                console.log(`Created user: ${user.email}`);
            } catch (err) {
                console.error(`Failed to create user ${user.email}:`, err.message);
            }
        }

        if (createdUsers.length > 0) {
            const studentUser = createdUsers.find(u => u.role === 'Student') || createdUsers[0];

            const products = [
                {
                    title: "Advanced Engineering Mathematics",
                    price: 450,
                    description: "Erwin Kreyszig 10th Edition. Good condition, some highlights.",
                    category: "Books",
                    condition: "Used",
                    seller: studentUser._id,
                    status: "Available",
                    image: "https://m.media-amazon.com/images/I/51xRlrQgRiL.jpg"
                },
                {
                    title: "Scientific Calculator Casio fx-991EX",
                    price: 800,
                    description: "Brand new condition, used only for one semester exams.",
                    category: "Electronics",
                    condition: "Like New",
                    seller: studentUser._id,
                    status: "Available",
                    image: "https://th.bing.com/th/id/OIP.N9D5A82V7yzot8R0UlLm8gHaG2?w=227&h=210&c=7&r=0&o=7&cb=ucfimg2&dpr=1.3&pid=1.7&rm=3&ucStudy"
                },
                {
                    title: "Study Table Lamp",
                    price: 300,
                    description: "Rechargeable LED lamp with 3 brightness modes.",
                    category: "Furniture",
                    condition: "Used",
                    seller: studentUser._id,
                    status: "Available",
                    image: "https://th.bing.com/th/id/OIP.m3zjnf3EF3EJ9FkKykMoigHaIJ?w=193&h=213&c=7&r=0&o=7&cb=ucfimg2&dpr=1.3&pid=1.7&rm=3&ucfimg=1"
                },
                {
                    title: "Drafter for Engineering Drawing",
                    price: 150,
                    description: "Omega drafter, in working condition. Rusty screws but precise.",
                    category: "Stationery",
                    condition: "Used",
                    seller: studentUser._id,
                    status: "Available",
                    image: "https://th.bing.com/th/id/OIP.Q48dbKufQnYVhNjsWZG1lwHaEL?w=320&h=180&c=7&r=0&o=7&cb=ucfimg2&dpr=1.3&pid=1.7&rm=3&ucfimg=1"
                }
            ];

            await Product.insertMany(products);
            console.log(`🌱 Seeded ${products.length} products.`);
        }

        console.log(`🌱 Seeded ${notices.length} notices, ${events.length} events.`);

        process.exit();
    })
    .catch(err => {
        console.error('❌ Error seeding:', err);
        process.exit(1);
    });
