import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { Application, Task } from "@/types/application";

const applicationsFile = path.join(process.cwd(), "data", "applications.json");

function readApplications(): Application[] {
  try {
    if (fs.existsSync(applicationsFile)) {
      const data = fs.readFileSync(applicationsFile, "utf-8");
      return JSON.parse(data);
    }
  } catch (error) {
    console.error("Error reading applications:", error);
  }
  return [];
}

function writeApplications(applications: Application[]): void {
  try {
    fs.writeFileSync(applicationsFile, JSON.stringify(applications, null, 2));
  } catch (error) {
    console.error("Error writing applications:", error);
    throw error;
  }
}

const DEFAULT_TASKS: Task[] =   [
    {
      id: "task_1",
      title: "Project Setup",
      description: "Set up the project workspace and outline objectives.",
      status: "pending",
    },
    {
      id: "task_2",
      title: "Core Delivery",
      description: "Build the core deliverable for this internship track.",
      status: "pending",
    },
    {
      id: "task_3",
      title: "Final Submission",
      description: "Document the work and submit the final repository or report.",
      status: "pending",
    },
  ];

const TASKS_BY_INTERNSHIP: Record<string, Task[]> = {
  "1":   [
    {
      id: "task_1",
      title: "Flashcard Quiz App",
      description: "Create a flashcard quiz app for studying. Users can: Each flashcard will have a question on the front and answer on the back , with a \"Show Answer\" button. Users can navigate between cards using \"Next\" and \"Previous\" buttons. Users should be able to add, edit, and delete flashcards for customization. The app should...",
      status: "pending",
    },
    {
      id: "task_2",
      title: "Random Quote Generator",
      description: "Develop an app that: The app should display a random quote every time the user opens the app or clicks a button. Include a \"New Quote\" button that shows a different quote on each click. Each quote should display text and author name clearly. The app must have a clean and minimal UI for better user experience.",
      status: "pending",
    },
    {
      id: "task_3",
      title: "Fitness Tracker App",
      description: "Create a fitness tracking app: The app should allow users to track daily fitness activities like steps, workouts, calories burned, etc. Users can add or log their fitness data manually (e.g., workout time, exercise type, calories). Include a dashboard or summary screen showing daily/weekly progress. UI should be...",
      status: "pending",
    },
    {
      id: "task_4",
      title: "Language Learning App",
      description: "Build an interactive language learning app: The app should help users learn new words, phrases, or sentences in a selected language. Include daily lessons or flashcards with translations and pronunciations. Users can take quizzes or practice tests to check their learning progress. The app should have a clean and...",
      status: "pending",
    },
  ],
  "2":   [
    {
      id: "task_1",
      title: "Language Translation Tool",
      description: "Create a user interface where user can enter text and select source & target languages. Use a translation API like Google Translate API or Microsoft Translator to process the input. Send the text to the API and get the translated response. Display the translated text clearly on the screen. Optional: Add a copy button...",
      status: "pending",
    },
    {
      id: "task_2",
      title: "Chatbot for FAQs Collect FAQs related to a",
      description: "Create a simple chat UI for user interaction.",
      status: "pending",
    },
    {
      id: "task_3",
      title: "Music Generation with AI Collect MIDI music data",
      description: "Build a deep learning model using RNNs (like LSTM) or GANs to learn music patterns. Train the model on the dataset to generate new music sequences. Convert generated sequences to MIDI and play or save them as audio.",
      status: "pending",
    },
    {
      id: "task_4",
      title: "Object Detection and Tracking Set up real-time video",
      description: "Object Detection and Tracking Set up real-time video input using a webcam or video file (OpenCV). Use a pre-trained model like YOLO or Faster R-CNN for object detection. Process each video frame to detect objects and draw bounding boxes. Apply object tracking using algorithms like SORT or Deep SORT. Display the output...",
      status: "pending",
    },
  ],
  "3":   [
    {
      id: "task_1",
      title: "2D Drafting Floor Plan",
      description: "Create a 2D floor plan of a residential house (minimum 2 bedrooms, kitchen, living room, and bathroom). Include proper dimensions, wall thickness, and labels. Add furniture layout (optional, for clarity). Submit the .dwg file and a PDF export of the drawing.",
      status: "pending",
    },
    {
      id: "task_2",
      title: "Mechanical Drawing Machine Part",
      description: "Design a 2D technical drawing of a machine component (e.g., gear, flange, nut-bolt assembly or bearing housing). Use correct dimensioning standards. Provide top, front, and side views with annotations. Submit AutoCAD source file + PDF.",
      status: "pending",
    },
    {
      id: "task_3",
      title: "3D Modeling",
      description: "Create a 3D model of any one of the following: A mechanical part (e.g., piston, crankshaft, or tool). A civil/architectural structure (e.g., staircase, bridge component, or room model). Apply materials, lighting, and rendering for presentation. Submit the 3D file + rendered image.",
      status: "pending",
    },
    {
      id: "task_4",
      title: "Real-World Project (Mini Project)",
      description: "Prepare a complete AutoCAD project in your domain: Civil: Site plan + sectional view of a small building. Mechanical: 3D assembly drawing of at least 3 4 parts. Architecture: Building layout with elevation and 3D visualization. Submit final drawing files + project report (2 3 pages explaining workflow and output).",
      status: "pending",
    },
  ],
  "4":   [
    {
      id: "task_1",
      title: "Simple URL Shortener",
      description: "Create a backend server using Flask (Python) or Express.js (Node.js). Build an API endpoint to accept long URLs and generate a unique short code. Store the mapping of short code and original URL in a database (like SQLite, MongoDB, etc.). Set up a redirect route where accessing the short URL takes the user to the...",
      status: "pending",
    },
    {
      id: "task_2",
      title: "Event Registration System Set up backend using Django",
      description: "Create models for events and user registrations in your database (like PostgreSQL, MongoDB etc.). Build API endpoints to view event list, event details, and submit registration forms. Link registrations to users and events, and allow users to manage (view/cancel) their registrations. Optional: Add management panel or...",
      status: "pending",
    },
    {
      id: "task_3",
      title: "Restaurant Management System Set up backend using Django",
      description: "Create APIs for placing orders, reserving tables, updating inventory, and viewing menu. Implement logic for order processing, table availability check, and inventory auto-update. Optional: Add reporting features (e.g., daily sales, stock alerts) and management access panel.",
      status: "pending",
    },
    {
      id: "task_4",
      title: "Job Board Platform Set up backend using Django",
      description: "Build API endpoints for posting jobs, searching jobs, uploading resumes, applying for jobs, and tracking applications. Implement logic for job search filters, resume uploads, application status updates, and employer notifications. Optional: Add management panel and reporting features like application statistics and user...",
      status: "pending",
    },
  ],
  "5":   [
    {
      id: "task_1",
      title: "DNA/Protein Sequence Analysis Download a DNA or protein",
      description: "Perform BLAST analysis to find homologous sequences. Document results (similarity, identity, alignment score). Submit screenshots + analysis report (2 3 pages).",
      status: "pending",
    },
    {
      id: "task_2",
      title: "Multiple Sequence Alignment Choose at least 5 protein",
      description: "Perform Multiple Sequence Alignment (MSA) using Clustal Omega/MUSCLE . Highlight conserved regions and motifs. Submit alignment results with interpretation.",
      status: "pending",
    },
    {
      id: "task_3",
      title: "Protein Structure Prediction Select one protein sequence from UniProt",
      description: "Protein Structure Prediction Select one protein sequence from UniProt. Use tools like SWISS-MODEL or AlphaFold DB to predict its 3D structure. Visualize the structure in PyMOL/Chimera . Submit structure images + short report on structural features.",
      status: "pending",
    },
    {
      id: "task_4",
      title: "Mini Project Bioinformatics Database/Tool Study",
      description: "Prepare a mini-project report (5 6 pages) on one of the following: Comparative study of bioinformatics databases (NCBI, UniProt, PDB). Role of bioinformatics in drug discovery. Applications of machine learning in bioinformatics. Submit in PDF format with proper references.",
      status: "pending",
    },
  ],
  "6":   [
    {
      id: "task_1",
      title: "Research Report",
      description: "Prepare a detailed report (1500 2000 words) on Recent Advancements in Biotechnology in one of the following areas: Genetic Engineering (CRISPR, Gene Therapy) Industrial Biotechnology (Biofuels, Enzymes, Bioplastics) Agricultural Biotechnology (GM crops, Biofertilizers) Medical Biotechnology (Vaccines, Diagnostics,...",
      status: "pending",
    },
    {
      id: "task_2",
      title: "Case Study Analysis Choose one real-world biotechnology startup/company",
      description: "Prepare a presentation (10 12 slides) .",
      status: "pending",
    },
    {
      id: "task_3",
      title: "Laboratory/Practical Task (Virtual/Research-Based) Since you may not have",
      description: "Research (case study on E. coli, yeast, or probiotics) Document your method, results, and conclusion (with images/screenshots if applicable).",
      status: "pending",
    },
    {
      id: "task_4",
      title: "Mini-Project / Proposal",
      description: "Prepare a mini project proposal (5 6 pages) on one of the following: Development of a low-cost biosensor for detecting diseases. Use of biotechnology in sustainable agriculture. AI/ML applications in biotechnology research. Role of biotechnology in climate change solutions. The proposal should include Introduction,...",
      status: "pending",
    },
  ],
  "7":   [
    {
      id: "task_1",
      title: "Simple Storage Smart Contract Declare an integer variable",
      description: "Make sure the value can be read from outside the contract (either by making the variable public or by creating a read function). Compile, deploy, and test the contract to confirm both increment and decrement work correctly",
      status: "pending",
    },
    {
      id: "task_2",
      title: "Multi-Send Smart Contract",
      description: "Create a Solidity contract that accepts an array of Ethereum addresses. Write a payable function that receives Ether with the transaction. Inside the function, use a loop to send an equal amount of Ether to each address in the array. Make sure to handle the Ether distribution correctly and check for successful...",
      status: "pending",
    },
    {
      id: "task_3",
      title: "Polling System Smart Contract",
      description: "Create a structure for a poll with a title, options, end time, and vote count (using mappings). Allow users to create polls by providing options and a voting deadline. Allow each address to vote only once before the deadline using time-based restrictions. Use mappings to store votes securely and prevent double voting....",
      status: "pending",
    },
    {
      id: "task_4",
      title: "Personal Portfolio (Crypto Locking) Smart Contract 1",
      description: "Create a smart contract where users can deposit Ether or tokens along with a lock-in time. 2. Store each user s deposit amount and unlock time using mappings. 3. Use Solidity s block.timestamp to enforce the time-lock. 4. Create a withdraw function that only allows users to withdraw after the lock time has passed. 5....",
      status: "pending",
    },
  ],
  "8":   [
    {
      id: "task_1",
      title: "Market",
      description: "Research Report Choose an industry or company of your interest. Conduct a SWOT analysis (Strengths, Weaknesses, Opportunities, Threats). Identify target audience, competitors and market trends. Submit a report (3 4 pages) with charts/graphs.",
      status: "pending",
    },
    {
      id: "task_2",
      title: "Business Growth Strategy Proposal",
      description: "Prepare a business strategy document for a startup/small business. Define business objectives. Suggest marketing mix (4Ps) and digital channels. Include short-term & long-term growth strategies. Submit proposal in PDF format (5 6 pages) .",
      status: "pending",
    },
    {
      id: "task_3",
      title: "Marketing Campaign",
      description: "Design Design a digital marketing campaign for a product/service of your choice. Include social media plan, content ideas, ad strategies, and budget estimation . Present expected outcomes (reach, leads, conversions). Submit in PowerPoint (8 10 slides) .",
      status: "pending",
    },
    {
      id: "task_4",
      title: "Case Study Analysis Pick a successful company s",
      description: "Analyze their business model & marketing techniques . Explain why the strategy worked and lessons learned. Submit a case study report (1500 2000 words)",
      status: "pending",
    },
  ],
  "9":   [
    {
      id: "task_1",
      title: "Basic Calculator Program",
      description: "Write a C program to perform basic arithmetic operations (Addition, Subtraction, Multiplication & Division). Use switch case for operation selection.",
      status: "pending",
    },
    {
      id: "task_2",
      title: "Medium Matrix Operations",
      description: "Write a program to implement: Matrix Addition Matrix Multiplication Transpose Use functions and 2D arrays for better modularity.",
      status: "pending",
    },
    {
      id: "task_3",
      title: "High Student Management System",
      description: "Create a menu-driven C program to manage student records. Features: Add, Delete, Update, Search, Display records. Use structures + file handling to store data permanently.",
      status: "pending",
    },
    {
      id: "task_4",
      title: "High Banking System (Mini Project)",
      description: "Build a Bank Account Management System in C. Functions: Deposit, Withdraw, Balance Enquiry, and Exit. Implement using functions, structures, and file handling .",
      status: "pending",
    },
  ],
  "10":   [
    {
      id: "task_1",
      title: "CGPA Calculator Take input for the number of courses taken by the student",
      description: "CGPA Calculator Take input for the number of courses taken by the student. For each course, input the grade and the credit hours. Calculate the total credits and total grade points (grade credit hours). Compute the GPA for the semester and then the overall CGPA. Display individual course grades and the final CGPA to...",
      status: "pending",
    },
    {
      id: "task_2",
      title: "Login and Registration System",
      description: "Create a registration function that takes username and password as input. Validate the inputs and check for duplicate usernames if needed. Store user credentials securely in a file (one file per user or a database file). Implement a login function that reads credentials and verifies user identity. Provide appropriate...",
      status: "pending",
    },
    {
      id: "task_3",
      title: "Sudoku Solver Represent the Sudoku grid as a 2D array",
      description: "Implement a backtracking algorithm to fill empty cells with valid numbers. Check for the Sudoku rules (row, column, and 3x3 subgrid constraints) before placing a number. Recursively try possible numbers until the puzzle is solved. (Optional) Add a GUI for easier user input and display of the solution.",
      status: "pending",
    },
    {
      id: "task_4",
      title: "Banking System",
      description: "Design classes for Customer , Account and Transaction with necessary attributes. Implement functions to create and manage customers and accounts. Include features for deposits , withdrawals and fund transfers . Store transaction history and allow users to view recent transactions. Display account information like...",
      status: "pending",
    },
  ],
  "11":   [
    {
      id: "task_1",
      title: "Residential Building Floor Plan",
      description: "Design a 2D floor plan of a G+1 residential building using AutoCAD. Include dimensions, wall thickness, and furniture layout. Add doors, windows, and labeling. Submit CAD file + PDF export.",
      status: "pending",
    },
    {
      id: "task_2",
      title: "Structural Load Analysis",
      description: "Perform a load calculation and analysis for a simple structure (beam, slab, or column). Consider dead load, live load and wind/earthquake load (basic level) . Present calculations and structural behavior. Submit report (2 3 pages) + calculation sheet.",
      status: "pending",
    },
    {
      id: "task_3",
      title: "3D Modeling & Visualization",
      description: "Create a 3D model of a small structure (house, bridge component, or commercial block) using AutoCAD/Revit/SketchUp. Apply materials and rendering for visualization. Submit design file + rendered images.",
      status: "pending",
    },
    {
      id: "task_4",
      title: "Mini Project Structural",
      description: "Design Proposal Prepare a mini project report (5 6 pages) on one of the following: Design & analysis of a small bridge Sustainable building design using green materials Earthquake-resistant building design concepts High-rise building load distribution study Submit report in PDF with diagrams/charts.",
      status: "pending",
    },
  ],
  "12":   [
    {
      id: "task_1",
      title: "Data Redundancy Removal System",
      description: "Design a system that identifies and classifies data as redundant or false positive . Implement a validation mechanism to check new data against existing data. Prevent duplicate data from being added into the cloud database. Append only unique and verified data entries to the database. Ensure database accuracy and...",
      status: "pending",
    },
    {
      id: "task_2",
      title: "Detecting Data Leaks Using SQL Injection",
      description: "Build a cloud system that secures user data against SQL injection attacks . Use AES-256 encryption to securely store user credentials and sensitive info. Implement a capability code mechanism to inject SQL securely and control server access. Provide a double-layer security protocol to prevent data leaks via SQL...",
      status: "pending",
    },
    {
      id: "task_3",
      title: "Cloud-Based Bus Pass System",
      description: "Develop an online ticket booking system hosted on the cloud. Ensure prevention of ticket loss, theft and incorrect pricing . Design the system to handle high traffic by dynamically provisioning servers. Focus on scalability and reliability improvements over traditional booking sites. Test and deploy the system to...",
      status: "pending",
    },
    {
      id: "task_4",
      title: "Making a Chatbot",
      description: "Design an AI-powered chatbot using either retrieval-based or generative models . Enable instant responses to user queries on websites. Train the chatbot with predefined input patterns for commercial use. Integrate the chatbot seamlessly with the target website interface. Optimize and test the chatbot for accuracy and...",
      status: "pending",
    },
  ],
  "13":   [
    {
      id: "task_1",
      title: "Blog Article for codeK Description: Write a 1000",
      description: "Build Careers or Future of AI & Coding Careers . Focus: Article must highlight codeK s role, add SEO keywords (internship, codeK, career, students, coding) and maintain professional tone.",
      status: "pending",
    },
    {
      id: "task_2",
      title: "Research Report on Education/Tech Trends Description",
      description: "Prepare a research-based report (800 1000 words) on Trends in Online Internships or How Virtual Internships Improve Employability . Focus: Mention codeK as a case study/example to showcase impact. Use authentic references.",
      status: "pending",
    },
    {
      id: "task_3",
      title: "Social Media Content for codeK Description: Draft 10",
      description: "Write in a way that encourages tagging @codeK . Must include catchy captions + 5 10 relevant hashtags (#codeK #Internship #CareerGrowth).",
      status: "pending",
    },
    {
      id: "task_4",
      title: "Case Study on codeK Intern Success Description",
      description: "Write a case study (600 800 words) featuring how a student benefited from codeK s internship (real or hypothetical). Focus: Showcase career growth, skill-building, or placement support through codeK.",
      status: "pending",
    },
    {
      id: "task_5",
      title: "Case Study on codeK Intern Success Description: Write",
      description: "Create a single folder in Google Drive using this format: codeK_YourName_ContentWriting (Example: codeK_YourName_ContentWriting) Upload all completed task files into this folder. Set the folder shareable : Anyone with the link can view.",
      status: "pending",
    },
  ],
  "14":   [
    {
      id: "task_1",
      title: "Basic Network Sniffer",
      description: "Build a Python program to capture network traffic packets. Analyze captured packets to understand their structure and content. Learn how data flows through the network and the basics of protocols. Use libraries like ` scapy ` or ` socket ` for packet capturing. Display useful information such as source/destination...",
      status: "pending",
    },
    {
      id: "task_2",
      title: "Phishing Awareness Training",
      description: "Create a presentation or online module focused on phishing attacks. Explain how to recognize phishing emails and fake websites . Educate about social engineering tactics used by attackers. Provide best practices and tips to avoid falling victim. Include real-world examples and interactive quizzes for better engagement.",
      status: "pending",
    },
    {
      id: "task_3",
      title: "Secure Coding Review Select a programming language and application to audit",
      description: "Perform a code review to identify security vulnerabilities . Use tools like static analyzers or manual inspection methods. Provide recommendations and best practices for secure coding. Document findings and suggest remediation steps for safer code.",
      status: "pending",
    },
    {
      id: "task_4",
      title: "Network Intrusion Detection System Set up a network-based",
      description: "Implement response mechanisms for detected intrusions. 5. Optionally, visualize detected attacks using dashboards or graphs.",
      status: "pending",
    },
  ],
  "15":   [
    {
      id: "task_1",
      title: "Web Scraping Use Python libraries like BeautifulSoup or",
      description: "Create custom datasets tailored to specific analysis needs.",
      status: "pending",
    },
    {
      id: "task_2",
      title: "Exploratory Data Analysis (EDA) Ask meaningful questions about",
      description: "Explore the data structure , including variables and data types. Identify trends, patterns and anomalies within the data. Test hypotheses and validate assumptions using statistics and visualization. Detect potential data issues or problems to address in further analysis.",
      status: "pending",
    },
    {
      id: "task_3",
      title: "Data Visualization Transform raw data into visual formats",
      description: "Build a strong portfolio with impactful and well-designed visualizations.",
      status: "pending",
    },
    {
      id: "task_4",
      title: "Sentiment Analysis",
      description: "Analyze text data to classify it as positive, negative or neutra . 2. Use NLP techniques and lexicons to detect specific emotions. 3. Apply analysis on data from sources like Amazon reviews, social media, and news sites . 4. Understand public opinion and trends through sentiment patterns. 5. Use results to inform...",
      status: "pending",
    },
  ],
  "16":   [
    {
      id: "task_1",
      title: "Iris Flower Classification Use measurements of Iris flowers",
      description: "Train a machine learning model to classify the species based on these measurements. Use libraries like Scikit-learn for easy dataset access and model building. Evaluate the model s accuracy and performance using test data. Understand basic classification concepts in machine learning. DOWNLOAD DATASET FROM here",
      status: "pending",
    },
    {
      id: "task_2",
      title: "Unemployment Analysis with Python",
      description: "Analyze unemployment rate data representing unemployed people percentage. Use Python for data cleaning, exploration, and visualization of unemployment trends. Investigate the impact of Covid-19 on unemployment rates . Identify key patterns or seasonal trends in the data. Present insights that could inform economic or...",
      status: "pending",
    },
    {
      id: "task_3",
      title: "Car Price Prediction with Machine Learning Collect car-related",
      description: "Train a regression model to predict car prices based on these features. Handle data preprocessing, feature engineering, and model evaluation Use Python libraries like Pandas, Scikit-learn and Matplotlib for the workflow. Understand real-world applications of machine learning in price prediction . DOWNLOAD DATASET FROM...",
      status: "pending",
    },
    {
      id: "task_4",
      title: "Sales Prediction using Python Predict future sales based",
      description: "Analyze how changes in advertising impact sales outcomes. Deliver actionable insights for business marketing strategies . DOWNLOAD DATASET FROM here",
      status: "pending",
    },
  ],
  "17":   [
    {
      id: "task_1",
      title: "CI/CD Pipeline using Azure",
      description: "Build an automated CI/CD pipeline with Azure Pipelines. Use Azure Container Registry for container storage. Deploy web apps via Azure App Service automatically. Monitor pipeline to ensure smooth execution . Learn key DevOps concepts using Azure tools.",
      status: "pending",
    },
    {
      id: "task_2",
      title: "Jenkins Remoting Project Set up Jenkins Remoting to connect remote Jenkins nodes",
      description: "Jenkins Remoting Project Set up Jenkins Remoting to connect remote Jenkins nodes. Distribute build loads across different machines securely. Run jobs on various architectures remotely. Improve security using node isolation . Gain hands-on experience with Jenkins remote execution capabilities.",
      status: "pending",
    },
    {
      id: "task_3",
      title: "Java Application using Gradle Automate Java project builds using Gradle",
      description: "Java Application using Gradle Automate Java project builds using Gradle . Manage dependencies efficiently in the Java app. Integrate CI/CD pipelines for continuous delivery. Streamline build and deployment processes. Understand core DevOps principles in Java development.",
      status: "pending",
    },
    {
      id: "task_4",
      title: "Web Server using Docker Learn Docker containerization basics",
      description: "Deploy and manage a web server inside Docker containers. Understand container lifecycle and commands. Monitor container health and troubleshoot issues. Explore container-based app deployment best practices.",
      status: "pending",
    },
  ],
  "18":   [
    {
      id: "task_1",
      title: "Social Media Campaign Design",
      description: "Create a 7-day content calendar for codeK s Instagram/LinkedIn page. Include post ideas, captions and hashtags that enhance brand visibility.",
      status: "pending",
    },
    {
      id: "task_2",
      title: "SEO & Keyword",
      description: "Research Research trending keywords related to internships, coding and training programs. Suggest at least 15 20 keywords with high search volume that codeK can use for blogs & posts.",
      status: "pending",
    },
    {
      id: "task_3",
      title: "Branding Strategy Document",
      description: "Prepare a short branding report (800 1000 words) suggesting how codeK can improve its online presence and engagement . Include competitor analysis, innovative campaign ideas and unique selling points.",
      status: "pending",
    },
    {
      id: "task_4",
      title: "Engagement Boost Project Design 3 promotional posts or",
      description: "Create a single Google Drive folder with this format: codeK_YourName_DigitalMarketing (Example: codeK_YourName_DigitalMarketing) Upload all files inside this folder. Make the folder shareable : Anyone with the link can view. Step 3:",
      status: "pending",
    },
  ],
  "19":   [
    {
      id: "task_1",
      title: "Stock Analysis Report Select any 3 Indian or US stocks",
      description: "Stock Analysis Report Select any 3 Indian or US stocks. Analyze: Price trends, PE ratio, market cap, recent news and performance indicators. Submit a 2 3 page report (PDF/Doc) with charts and conclusion.",
      status: "pending",
    },
    {
      id: "task_2",
      title: "Cryptocurrency Portfolio Analysis Choose 3 cryptocurrencies (e.g., BTC,",
      description: "Prepare a performance and risk analysis report over the past 12 months. Submit Google Sheet + PDF report showing insights and recommendations.",
      status: "pending",
    },
    {
      id: "task_3",
      title: "Investment Portfolio Creation",
      description: "Build a hypothetical investment portfolio worth 1,00,000. Include allocation in stocks, ETFs, and crypto with rationale. Submit Google Sheet + short 1 2 page explanation PDF .",
      status: "pending",
    },
    {
      id: "task_4",
      title: "Mini Project Market Research / Investment Strategy Prepare",
      description: "Create a single folder in Google Drive using this format: codeK_YourName_ContentWriting (Example: codeK_YourName_ContentWriting) Upload all completed task files into this folder. Set the folder shareable : Anyone with the link can view. Step 3:",
      status: "pending",
    },
  ],
  "20":   [
    {
      id: "task_1",
      title: "Image Gallery",
      description: "Design an image gallery using HTML and CSS layout. Use JavaScript for navigation (next/prev buttons, lightbox view). Add hover effects and smooth transitions. Ensure responsive design for different screen sizes. Bonus: Add image filters or categories.",
      status: "pending",
    },
    {
      id: "task_2",
      title: "Build a Calculator",
      description: "Create a basic calculator using HTML, CSS, and JavaScript. Include all arithmetic operations : +, , , . Design a user interface with buttons and display screen . Handle user input, clearing screen, and real-time result display. Bonus: Add keyboard support and styling enhancements.",
      status: "pending",
    },
    {
      id: "task_3",
      title: "Build Your Own Portfolio Site",
      description: "Design a personal portfolio using HTML, CSS and optional JS. Showcase your skills, projects, resume and contact info . Use a clean, responsive layout with sections for About, Projects, etc. Add smooth scroll, animations and hover effects. Bonus: Deploy it on GitHub Pages or Netlify .",
      status: "pending",
    },
    {
      id: "task_4",
      title: "Music Player using JavaScript",
      description: "Create a music player interface using HTML & styled with CSS. Use JavaScript for audio control (play, pause, next, previous). Add functionality for showing song title, artist, duration . Include a progress bar and volume control . Bonus: Add playlist and autoplay features.",
      status: "pending",
    },
  ],
  "21":   [
    {
      id: "task_1",
      title: "Simple E-commerce Store",
      description: "Build a basic e-commerce site with product listings. Frontend: HTML, CSS, JavaScript . Backend: Use Django (Python) or Express.js (Node.js). Add features like: Shopping cart Product details page Order processing",
      status: "pending",
    },
    {
      id: "task_2",
      title: "Social Media Platform",
      description: "Create a mini social media app . Features to implement: User profiles Posts & comments Like/follow system Frontend: HTML, CSS, JavaScript Backend: Django or Express.js Database for users, posts, comments, followers .",
      status: "pending",
    },
    {
      id: "task_3",
      title: "Project Management Tool Build a collaborative tool similar",
      description: "Create group projects Assign tasks Comment and communicate within tasks Full stack with auth system, project boards, task cards . Backend to manage users, projects, tasks, comments . Bonus: Add notifications and real-time updates using WebSockets.",
      status: "pending",
    },
    {
      id: "task_4",
      title: "Real-Time Communication App A video conferencing + collaboration tool",
      description: "Real-Time Communication App A video conferencing + collaboration tool . Core features: Video calling (multi-user) Screen sharing File sharing Whiteboard for drawing/writing Data encryption User authentication Tools/Libraries: WebRTC for real-time media Socket.io or Firebase for real-time communication Secure backend...",
      status: "pending",
    },
  ],
  "22":   [
    {
      id: "task_1",
      title: "LOGO REDESIGN Objective: Redesign the existing logo to",
      description: "Create multiple variations and explain the design logic. Tools: Adobe Illustrator, CorelDRAW, Figma, Canva.",
      status: "pending",
    },
    {
      id: "task_2",
      title: "USER INTERFACE DESIGN Objective",
      description: "Design UI/UX for web and mobile applications. Key Deliverables: Wireframes, mockup and clickable prototypes . Focus on user flow , intuitiveness and aesthetic alignment . Collaborate on real-time projects to test UI effectiveness. Tools: Figma, Adobe XD, Sketch, InVision.",
      status: "pending",
    },
    {
      id: "task_3",
      title: "TYPOGRAPHY PRACTICE Objective: Master the art of typography",
      description: "Create impactful text-based designs . Understand the psychological effect of different type styles. Tools: Adobe Illustrator, Photoshop, Canva.",
      status: "pending",
    },
    {
      id: "task_4",
      title: "STORYBOARDING DESIGN Objective: Design storyboards to visualize narratives",
      description: "Develop compelling sequences for videos, animations, or user flows . Collaborate with content creators and animators for execution. Tools: Storyboard That, Adobe Illustrator, Photoshop, Procreate.",
      status: "pending",
    },
  ],
  "23":   [
    {
      id: "task_1",
      title: "Recruitment & Job Description",
      description: "Prepare a Job Description (JD) for any two roles (e.g., Software Developer, HR Executive). Include job responsibilities, qualifications, and required skills. Submit as a Word/PDF document .",
      status: "pending",
    },
    {
      id: "task_2",
      title: "R Policy Drafting",
      description: "R Policy Drafting",
      status: "pending",
    },
    {
      id: "task_3",
      title: "Employee Engagement Survey",
      description: "Design an Employee Engagement or Satisfaction Survey (10 15 questions). Use Google Forms or MS Word. Analyze sample responses (at least 5 people) and prepare a 1 2 page summary report .",
      status: "pending",
    },
    {
      id: "task_4",
      title: "Mini Project HR Trends Report Write a research-based",
      description: "Make the folder shareable (Anyone with the link can view) . 4. Paste the folder link in the",
      status: "pending",
    },
  ],
  "24":   [
    {
      id: "task_1",
      title: "Research Report IoT in Real Life",
      description: "Write a report (800 1000 words) on IoT applications in one of the following: Smart Homes Smart Agriculture Healthcare Monitoring Industrial Automation Submit in PDF format with references .",
      status: "pending",
    },
    {
      id: "task_2",
      title: "Sensor-Based Simulation Simulate an IoT system using Tinkercad/Proteus",
      description: "Sensor-Based Simulation Simulate an IoT system using Tinkercad/Proteus (no hardware required). Example: LED on/off using a sensor (Temperature/Light/Motion). Submit simulation screenshots + code explanation .",
      status: "pending",
    },
    {
      id: "task_3",
      title: "IoT Prototype with Arduino/Raspberry Pi (Optional if hardware available)",
      description: "Build a simple IoT project, such as: Smart door lock system Temperature & humidity monitoring system Motion detection alarm Submit code + circuit diagram + output images .",
      status: "pending",
    },
    {
      id: "task_4",
      title: "Mini Project IoT Case Study Prepare a 5",
      description: "Make the folder shareable (Anyone with the link can view) . 4. Paste the folder link in the",
      status: "pending",
    },
  ],
  "25":   [
    {
      id: "task_1",
      title: "Student Grade Tracker",
      description: "Build a Java program to input and manage student grades . Calculate average, highest, and lowest scores . Use arrays or ArrayLists to store and manage data. Display a summary report of all students. Make the interface console-based or GUI-based as desired.",
      status: "pending",
    },
    {
      id: "task_2",
      title: "Stock Trading Platform Simulate a basic stock trading environment",
      description: "Stock Trading Platform Simulate a basic stock trading environment . Add features for market data display and buy/sell operations . Allow users to track portfolio performance over time. Use Object-Oriented Programming (OOP) to manage stocks, users and transactions. Optionally, include file I/O or database to persist...",
      status: "pending",
    },
    {
      id: "task_3",
      title: "Artificial Intelligence Chatbot",
      description: "Create a Java-based chatbot for interactive communication. Use Natural Language Processing (NLP) techniques. Implement machine learning logic or rule-based answers . Train the bot to respond to frequently asked questions. Integrate with a GUI or web interface for real-time interaction.",
      status: "pending",
    },
    {
      id: "task_4",
      title: "Hotel Reservation System",
      description: "Design a system to search, book, and manage hotel rooms . Add room categorization (e.g., Standard, Deluxe, Suite) Allow users to make and cancel reservations . Implement payment simulation and booking details view . Use OOP + database/File I/O for storing bookings and availability.",
      status: "pending",
    },
  ],
  "26":   [
    {
      id: "task_1",
      title: "Credit Scoring Model Objective: Predict an individual's creditworthiness",
      description: "Credit Scoring Model Objective: Predict an individual's creditworthiness using past financial data. Approach: Use classification algorithms like Logistic Regression, Decision Trees, or Random Forest. Key Features: Feature engineering from financial history. Model accuracy assessment using metrics like Precision,...",
      status: "pending",
    },
    {
      id: "task_2",
      title: "Emotion Recognition from Speech Objective: Recognize human emotions (e",
      description: "Emotion Recognition from Speech Objective: Recognize human emotions (e.g., happy, angry, sad) from speech audio. Approach: Apply deep learning and speech signal processing techniques. Key Features: Extract features like MFCCs (Mel-Frequency Cepstral Coefficients) . Use models like CNN , RNN , or LSTM . Datasets:...",
      status: "pending",
    },
    {
      id: "task_3",
      title: "Handwritten Character Recognition Objective: Identify handwritten characters or",
      description: "Handwritten Character Recognition Objective: Identify handwritten characters or alphabets . Approach: Use image processing and deep learning . Key Features: Dataset: MNIST (digits), EMNIST (characters). Model: Convolutional Neural Networks (CNN) . Extendable to full word or sentence recognition with sequence modeling...",
      status: "pending",
    },
    {
      id: "task_4",
      title: "Disease Prediction from Medical Data Objective: Predict the",
      description: "Disease Prediction from Medical Data Objective: Predict the possibility of diseases based on patient data. Approach: Apply classification techniques to structured medical datasets. Key Features: Use features like symptoms, age, blood test results, etc. Algorithms: SVM, Logistic Regression, Random Forest, XGBoost....",
      status: "pending",
    },
  ],
  "27":   [
    {
      id: "task_1",
      title: "3D CAD Model Creation",
      description: "Design a mechanical component or assembly (e.g., gear, crankshaft, bearing housing, or connecting rod) using AutoCAD/SolidWorks/Creo. Include proper dimensions and material selection. Submit the CAD file + rendered images.",
      status: "pending",
    },
    {
      id: "task_2",
      title: "Structural Simulation (FEA) Perform a Finite Element Analysis",
      description: "Analyze stress distribution, deformation, and factor of safety . Submit simulation report with screenshots and observations.",
      status: "pending",
    },
    {
      id: "task_3",
      title: "Motion Simulation",
      description: "Create a mechanism model (e.g., slider-crank, four-bar linkage or gear train). Run a motion simulation to analyze velocity, acceleration and forces. Present results in graphical/animated format. Submit simulation file + short report.",
      status: "pending",
    },
    {
      id: "task_4",
      title: "Mini Project Real-World Mechanical System Work on a",
      description: "Design & simulate a suspension arm. Aerospace: Structural analysis of a wing component. Manufacturing: 3D model of a CNC machine part with stress analysis. Submit CAD model + simulation results + 2 3 page project report.",
      status: "pending",
    },
  ],
  "28":   [
    {
      id: "task_1",
      title: "Literature Review on Drug Development Choose any FDA-approved",
      description: "Prepare a literature review (1500 2000 words) covering: Drug discovery process Clinical trial phases Therapeutic applications Market impact Submit in PDF with proper references.",
      status: "pending",
    },
    {
      id: "task_2",
      title: "Case Study Drug Formulation Select a common dosage",
      description: "Case Study Drug Formulation Select a common dosage form (tablet, capsule, injection, ointment). Explain the formulation process , excipients used, stability factors, and challenges. Add diagrams/tables if needed. Submit as a 6 8 slide presentation (PPT/PDF).",
      status: "pending",
    },
    {
      id: "task_3",
      title: "Pharmacovigilance & Adverse Drug Reaction (ADR) Analysis Select",
      description: "Prepare a report on: Mechanism of action Reported ADRs (from WHO/DrugBank database) Measures to reduce risks Submit report (2 3 pages).",
      status: "pending",
    },
    {
      id: "task_4",
      title: "Mini Project Role of AI & Biotechnology in Pharma",
      description: "Prepare a mini research project (5 6 pages) on one of the following: AI in drug discovery and repurposing Biotechnology in vaccine development Nanotechnology in targeted drug delivery Submit in PDF format with citations.",
      status: "pending",
    },
  ],
  "29":   [
    {
      id: "task_1",
      title: "Financial Health Dashboard Objective",
      description: "Develop a dashboard analyzing an organization's financial status with real-time insights, perfect for SMEs. Key Requirements: Visualize income statements, balance sheets, and cash flows. Analyze profitability trends over time. Provide forecashbvting for budgeting and financial planning. Deliverable: An interactive...",
      status: "pending",
    },
    {
      id: "task_2",
      title: "Human Resources Analytics Objective",
      description: "Create a dashboard to analyze and optimize HR processes and workforce management. Key Requirements: Track recruitment metrics and employee turnover rates . Analyze employee satisfaction and performance data . Implement predictive analytics for forecasting hiring needs. Deliverable: An interactive Power BI report...",
      status: "pending",
    },
    {
      id: "task_3",
      title: "Real Estate Market Trends Objective",
      description: "Build a dashboard to analyze real estate market dynamics for investment and development decisions. Key Requirements: Analyze property prices and rental yields . Track market demand, supply conditions , and economic indicators . Use geographical visualizations like heat maps for identifying market hotspots....",
      status: "pending",
    },
    {
      id: "task_4",
      title: "Educational Performance and Resource Allocation Objective: (Content missing,",
      description: "Develop a dashboard to evaluate student performance and optimize resource allocation in educational institutions. Expected Features: Visualize academic performance metrics. Analyze resource usage and identify gaps. Support data-driven decisions in education management.",
      status: "pending",
    },
  ],
  "30":   [
    {
      id: "task_1",
      title: "Hangman Game Goal",
      description: "Create a simple text-based Hangman game where the player guesses a word one letter at a time. Simplified Scope: Use a small list of 5 predefined words (no need to use a file or API). Limit incorrect guesses to 6. Basic console input/output no graphics or audio. Key Concepts Used: random, while loop, if-else, strings,...",
      status: "pending",
    },
    {
      id: "task_2",
      title: "Stock Portfolio Tracker Goal",
      description: "Build a simple stock tracker that calculates total investment based on manually defined stock prices. Simplified Scope: User inputs stock names and quantity. Use a hardcoded dictionary to define stock prices (e.g., {\"AAPL\": 180, \"TSLA\": 250}). Display total investment value and optionally save the result in a .txt or...",
      status: "pending",
    },
    {
      id: "task_3",
      title: "Task Automation with Python Scripts Goal: Automate a",
      description: "Task Automation with Python Scripts Goal: Automate a small, real-life repetitive task. Pick One of These Ideas: Move all .jpg files from a folder to a new folder. Extract all",
      status: "pending",
    },
    {
      id: "task_4",
      title: "Basic Chatbot Goal",
      description: "Build a simple rule-based chatbot. Scope: Input from user like: \"hello\", \"how are you\", \"bye\". Predefined replies like: \"Hi!\", \"I'm fine, thanks!\", \"Goodbye!\". Key Concepts Used: if-elif, functions, loops, input/output.",
      status: "pending",
    },
  ],
  "31":   [
    {
      id: "task_1",
      title: "Research Report on Robotics Applications",
      description: "Prepare a detailed report (1500 2000 words) on robotics in one of the following areas: Healthcare (surgical robots, rehabilitation) Manufacturing & Industry 4.0 Autonomous vehicles & drones Service robots (domestic, military, agricultural) Submit in PDF with proper references.",
      status: "pending",
    },
    {
      id: "task_2",
      title: "Robotic Arm Simulation",
      description: "Design a 2D/3D model of a robotic arm using AutoCAD/SolidWorks/any simulation software. Define degrees of freedom (DOF). Perform a basic motion simulation (pick-and-place). Submit CAD/simulation files + screenshots.",
      status: "pending",
    },
    {
      id: "task_3",
      title: "Automation System Design",
      description: "Create a flowchart or circuit diagram for an automated system such as: Smart home lighting system Conveyor belt with sensors Automated packaging system Submit design file + short explanation report (2 3 pages).",
      status: "pending",
    },
    {
      id: "task_4",
      title: "Mini Project Robotics/Automation Proposal",
      description: "Prepare a mini project (5 6 pages) on one of the following: IoT in robotics and automation Role of AI in autonomous robots PLC-based automation system design Humanoid robot design concepts Submit project report in PDF format.",
      status: "pending",
    },
  ],
  "32":   [
    {
      id: "task_1",
      title: "Stock Market Basics Research Report",
      description: "Write a short report (800 1000 words) explaining: What is the stock market? Primary vs Secondary market Role of SEBI in India Submit in PDF format.",
      status: "pending",
    },
    {
      id: "task_2",
      title: "Company Stock Analysis Choose any listed company (e",
      description: "Company Stock Analysis Choose any listed company (e.g., Infosys, Reliance, TCS, Tesla, Apple) . Analyze: Share price trend (last 6 12 months) PE ratio, Market Cap, Dividend history Future growth prospects Submit a 2 3 page report with charts/graphs.",
      status: "pending",
    },
    {
      id: "task_3",
      title: "Trading Simulation (Virtual) Use any free stock market",
      description: "Create a mock portfolio worth 1,00,000 (or $10,000) . Perform at least 5 virtual trades and record: Stock name, buy price, sell price, profit/loss Submit a spreadsheet + summary report .",
      status: "pending",
    },
    {
      id: "task_4",
      title: "Mini Project Trading Strategy Case Study",
      description: "Prepare a case study (5 6 pages) on one of the following: Long-term investing vs short-term trading Basics of technical indicators (RSI, MACD, Moving Averages) Behavioral psychology in trading (fear & greed index) Submit in PDF format with references.",
      status: "pending",
    },
  ],
  "33":   [
    {
      id: "task_1",
      title: "Wireframing & Low-Fidelity Design",
      description: "Create wireframes for a mobile app or website (e.g., food delivery, e-commerce or education platform). Submit wireframes in Figma/Adobe XD .",
      status: "pending",
    },
    {
      id: "task_2",
      title: "High-Fidelity UI",
      description: "Design Convert the wireframe into a high-fidelity UI design . Add color palettes, typography, buttons, icons, and images . Ensure the design follows UI/UX principles .",
      status: "pending",
    },
    {
      id: "task_3",
      title: "UX Case Study Pick a popular app/website (e.g., Zomato, Flipkart, Paytm)",
      description: "Analyze its user journey, strengths, and weaknesses . Suggest 3 improvements with sample sketches or mockups. Submit as a case study report (4 5 pages) .",
      status: "pending",
    },
    {
      id: "task_4",
      title: "Mini Project Prototype Design",
      description: "Create a clickable prototype of a complete app or website using Figma/Adobe XD . Example Projects: Online Learning Platform, Travel Booking App, Personal Portfolio Website. Submit prototype link + 2 3 page design explanation.",
      status: "pending",
    },
  ],
};

function getTasksForInternship(internshipId: string | undefined): Task[] {
  if (internshipId && TASKS_BY_INTERNSHIP[internshipId]) {
    return TASKS_BY_INTERNSHIP[internshipId];
  }
  return DEFAULT_TASKS;
}

export async function POST(request: NextRequest) {
  try {
    const { applicationId } = await request.json();

    if (!applicationId) {
      return NextResponse.json(
        { error: "Missing required field: applicationId" },
        { status: 400 }
      );
    }

    const applications = readApplications();
    const application = applications.find((app) => app.id === applicationId);

    if (!application) {
      return NextResponse.json(
        { error: "Application not found" },
        { status: 404 }
      );
    }

    // Assign tasks only if not already assigned
    if (!application.tasks || application.tasks.length === 0) {
      const sourceTasks = getTasksForInternship(application.internshipId);
      application.tasks = sourceTasks.map((task) => ({
        ...task,
        id: `${task.id}_${Date.now()}`, // Unique task ID
      }));
      application.approvedAt = new Date().toISOString();
      application.status = "approved";

      writeApplications(applications);
    }

    return NextResponse.json({
      message: "Tasks assigned successfully",
      tasks: application.tasks,
    });
  } catch (error) {
    console.error("Task assignment error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
