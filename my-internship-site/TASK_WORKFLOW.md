# Task Submission Workflow - Implementation Guide

## Overview
This document explains the complete task submission workflow implemented for the internship platform. Students can now receive tasks upon approval and submit their work directly through the student dashboard.

---

## Workflow Steps

> **Note:** The initial application form does **not** ask for a Git repository URL. Students only see the repo submission field once their application has been approved and tasks are assigned.

### 1. **Application Approval (Admin Side)**
   - Admin logs into the admin panel (`/admin`) with password
   - Reviews pending applications
   - Clicks **"✓ Approve"** button on an application
   - **Automatic actions:**
     - Application status changes to `approved`
     - **4 default tasks are automatically assigned** to the applicant:
       1. Project Setup & Configuration (task_1)
       2. Feature Implementation (task_2)
       3. Testing & Bug Fixes (task_3)
       4. Final Submission & Documentation (task_4)
     - Admin can optionally send approval email

### 2. **Student Receives Approval + Tasks**
   - Student logs into student dashboard (`/student`) with their email
   - They see the application status changed to **"APPROVED"**
   - A new **blue task section** appears showing all 4 assigned tasks
   - Each task displays:
     - Task name
     - Task description
     - Current status (PENDING / SUBMITTED / COMPLETED)

### 3. **Student Submits Task Work**
   - For each task with **PENDING** status:
     - Student enters their **GitHub repository URL** or project link
     - Clicks **"Submit"** button
     - System validates the URL and saves submission
     - Task status changes to **SUBMITTED**
     - Submission timestamp is recorded
   - Student can submit tasks in any order, at any time

### 4. **Admin Reviews Task Submissions**
   - Admin can see in the admin panel:
     - How many tasks are submitted (e.g., "2/4 submitted")
     - Individual task status for each submission
     - Direct links to the submitted GitHub repos

### 5. **Task Completion & Status Update**
   - When ALL 4 tasks are submitted:
     - Application status automatically changes to **COMPLETED**
   - Admin can also manually mark as completed from the admin panel
   - Student is notified of completion status

### 6. **Payment & Document Generation**
   - Once application is **COMPLETED**:
     - Payment button appears: **"Pay ₹99"**
     - Student pays via PhonePe (QR code shown)
     - After payment confirmation:
       - Can download **Offer Letter**
       - Can download **Completion Certificate**

---

## Database Structure

### Application Type (Updated)
```typescript
interface Application {
  id: string;
  internshipId: string;
  fullName: string;
  email: string;
  phone: string;
  resume: string;
  coverLetter: string;
  status: "pending" | "approved" | "completed" | "rejected";
  tasks?: Task[];              // NEW: Array of assigned tasks
  repoUrl?: string;
  paid?: boolean;
  paymentId?: string;
  paidAt?: string;
  appliedAt: string;
  approvedAt?: string;         // NEW: Approval timestamp
}
```

### Task Type (New)
```typescript
interface Task {
  id: string;
  title: string;
  description: string;
  submittedUrl?: string;       // GitHub/project link
  submittedAt?: string;        // Submission timestamp
  status: "pending" | "submitted" | "completed";
}
```

---

## API Endpoints

### 1. **Assign Tasks**
- **Endpoint:** `POST /api/tasks/assign`
- **Request:**
  ```json
  {
    "applicationId": "app_123"
  }
  ```
- **Response:** Returns the 4 assigned tasks
- **Called by:** Admin approval action

---

### 2. **Submit Task**
- **Endpoint:** `POST /api/tasks/submit`
- **Request:**
  ```json
  {
    "applicationId": "app_123",
    "taskId": "task_1_12345",
    "submittedUrl": "https://github.com/user/project"
  }
  ```
- **Response:**
  ```json
  {
    "message": "Task submitted successfully",
    "task": { ...updated task },
    "applicationStatus": "approved"
  }
  ```
- **Validation:**
  - URL must be valid (contains github.com or starts with http)
  - Application must be in `approved` status
  - Task must exist in the application
  - If all 4 tasks submitted → status becomes `completed`

---

## Component Structure

### New Components
1. **TaskSubmissionSection** (`/src/components/TaskSubmissionSection.tsx`)
   - Displays all tasks assigned to an application
   - Shows task submission form
   - Validates URLs
   - Shows submission status and timestamps
   - Refreshes data on successful submission

### Updated Components
1. **Student Dashboard** (`/src/app/student/page.tsx`)
   - Integrated TaskSubmissionSection for approved applications
   - Shows tasks only when status is "approved"
   - Refreshes applications list after task submission

2. **Admin Dashboard** (`/src/app/admin/page.tsx`)
   - Shows task submission count per application
   - Displays individual task statuses
   - Auto-assigns tasks on approval
   - Shows task details in collapsed view

---

## File Structure
```
src/
├── app/
│   ├── api/
│   │   ├── tasks/
│   │   │   ├── assign/route.ts      (NEW)
│   │   │   └── submit/route.ts      (NEW)
│   │   └── documents/[id]/[type]/route.ts
│   ├── admin/page.tsx               (UPDATED)
│   └── student/page.tsx             (UPDATED)
├── components/
│   └── TaskSubmissionSection.tsx    (NEW)
└── types/
    └── application.ts              (UPDATED)
```

---

## Default Tasks
All students receive these 4 tasks upon approval:

| Task | Title | Description |
|------|-------|-------------|
| 1 | Project Setup & Configuration | Set up the project repository with proper structure, dependencies, and documentation. |
| 2 | Feature Implementation | Implement core features according to project requirements and best practices. |
| 3 | Testing & Bug Fixes | Write tests, identify bugs, and implement fixes for quality assurance. |
| 4 | Final Submission & Documentation | Complete final touches, add comprehensive documentation, and submit the project. |

---

## Testing the Workflow

### Step 1: Create an Application
1. Go to `/apply?id=1` (select an internship)
2. Fill in the form and submit
3. Note the generated application ID

### Step 2: Admin Approval
1. Go to `/admin`
2. Login with password: `admin123`
3. Find your test application
4. Click **"✓ Approve"**
5. Confirm: "Application approved and tasks assigned!"

### Step 3: Student View
1. Go to `/student`
2. Enter your email address
3. Click **"Search"**
4. You should see:
   - Status changed to "APPROVED" (green badge)
   - New blue section with 4 pending tasks
   - Input fields to submit GitHub links for each task

### Step 4: Submit Tasks
1. For each task, paste a GitHub repo URL
2. Click **"Submit"**
3. Watch the task status change to "SUBMITTED"
4. Once all 4 submitted → application becomes "COMPLETED"

### Step 5: Payment & Documents
1. Payment button appears after completion
2. Pay ₹99 to unlock document downloads
3. Download offer letter and completion certificate

---

## Key Features

✅ **Automatic Task Assignment**: Tasks assigned instantly on approval
✅ **URL Validation**: Ensures GitHub/project URLs are valid
✅ **Status Tracking**: Real-time status updates for each task
✅ **Timestamps**: Records when each task was submitted
✅ **Auto-Completion**: Application completes automatically when all tasks submitted
✅ **Admin Oversight**: Admin can see all task submissions and review them

---

## Error Handling

The system handles these error cases:

| Error | Message | Status Code |
|-------|---------|------------|
| Missing applicationId | "Missing required field: applicationId" | 400 |
| Application not found | "Application not found" | 404 |
| Not approved | "Application must be in approved status..." | 403 |
| Invalid URL | "Please provide a valid GitHub repository URL..." | 400 |
| Task not found | "Task not found" | 404 |

---

## Future Enhancements

1. **Email Notifications**: Send email when tasks are assigned
2. **Custom Tasks**: Allow admins to customize tasks per internship
3. **Task Deadlines**: Add due dates for each task
4. **Review Comments**: Admin can add comments on task submissions
5. **Task Ranking**: Admin can mark tasks as "completed" vs "pending review"
6. **Bulk Task Update**: Allow admins to update multiple task statuses at once

---

## Technical Notes

- **Runtime**: API routes use `'nodejs'` runtime for file system access
- **Data Persistence**: Applications stored in `/data/applications.json`
- **Task IDs**: Dynamically generated with timestamp to ensure uniqueness
- **Status Flow**: pending → approved → completed → ready for payment

---

**Implementation Date**: February 28, 2026
**Version**: 1.0
