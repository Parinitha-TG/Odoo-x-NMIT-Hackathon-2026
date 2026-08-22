# Flow HR Suite

Build a modern, production-quality HRMS web application called "Dayflow".

IMPORTANT:

- Frontend-first implementation.

- Use React with Vite.

- Do NOT build a backend or database yet.

- Use realistic mock data only.

- Do NOT add authentication yet.

- Focus heavily on polished UI/UX, responsiveness, accessibility, and clean component architecture.

- The application should look like a serious modern SaaS product, not a generic template.

PRODUCT:

Dayflow is an employee management and HR management system for organizations.

DESIGN DIRECTION:

- Modern SaaS dashboard aesthetic

- Clean, professional, minimal interface

- White/light neutral background with a refined indigo/blue primary accent

- Subtle borders and shadows

- Rounded cards, but avoid excessive rounded/pill styling

- Excellent typography hierarchy

- Spacious layout

- Desktop-first but fully responsive for tablet and mobile

- Smooth hover and active states

- Small, tasteful transitions

- Use Lucide icons

- Avoid gradients unless they genuinely improve the design

- Avoid excessive animations

- Make the UI look credible for a hackathon evaluator and suitable for a real HR product

MAIN APP STRUCTURE:

1. SIDEBAR

Create a persistent left sidebar containing:

- Dayflow logo/wordmark

- Dashboard

- Attendance

- Leave

- Payroll

- My Profile

- Settings

At the bottom:

- Help & Support

- User profile section

- Employee name: Nirjala Chauhan

- Role: Employee

Sidebar should collapse responsively on smaller screens.

2. TOP NAVBAR

Include:

- Page title/breadcrumb

- Search

- Notification icon

- User avatar

- Employee name

- Profile dropdown

3. EMPLOYEE DASHBOARD

Create a polished dashboard with:

Header:

"Good morning, Nirjala 👋"

Subtitle:

"Here's your work overview for today."

Summary cards:

- Attendance

  Status: Present

  Check-in: 09:12 AM

- Working Hours

  7h 42m

  Show progress toward an 8-hour workday

- Leave Balance

  12 days

  Show available leave

- Next Payroll

  5 days

  Show upcoming payroll date

Attendance section:

- Weekly attendance overview

- Monday through Sunday

- Present/Absent/Leave states

- Use a clean chart visualization

Today's activity:

- Check-in — 09:12 AM

- Break started — 01:05 PM

- Break ended — 01:45 PM

- Current status — Working

Add a prominent but tasteful:

"Check Out" button when the employee is currently working.

Upcoming:

- Upcoming holidays

- Pending leave request

- Next payroll date

4. ATTENDANCE PAGE

Create a complete attendance page with:

- Current attendance status

- Check-in button

- Check-out button

- Today's working duration

- Break duration

- Weekly attendance table

- Monthly attendance summary

- Calendar-style attendance view

Use mock data.

5. LEAVE PAGE

Create:

- Leave balance cards

- Casual Leave

- Sick Leave

- Earned Leave

Add:

"Request Leave" button.

Create a leave request modal containing:

- Leave type

- Start date

- End date

- Reason

- Submit button

Below it show:

- Pending requests

- Approved requests

- Rejected requests

6. PAYROLL PAGE

Create:

- Current salary summary

- Latest payslip

- Earnings

- Deductions

- Net salary

- Payroll history table

- Download payslip buttons

Use mock values and clearly label them as sample/demo data.

7. PROFILE PAGE

Create an employee profile with:

- Profile photo/avatar

- Full name

- Employee ID

- Department

- Job title

- Email

- Phone

- Date of joining

- Manager

- Work location

Organize information into clean sections.

8. SETTINGS PAGE

Include:

- Account settings

- Notification preferences

- Appearance

- Privacy

- Change password UI

No real authentication or password functionality yet.

9. ADMIN/HR DASHBOARD

Also create a separate HR/Admin dashboard accessible from a role switcher or admin navigation.

Admin dashboard should include:

- Total employees

- Present today

- On leave

- Absent

- Pending leave requests

- Payroll overview

Add:

- Employee table

- Search employees

- Department filter

- Status filter

- Add employee button

- View employee button

10. RESPONSIVENESS

The application must work properly on:

- Desktop

- Laptop

- Tablet

- Mobile

On mobile:

- Sidebar becomes a drawer

- Tables become horizontally scrollable or responsive cards

- Dashboard cards stack appropriately

- Buttons remain easy to tap

11. COMPONENT ARCHITECTURE

Organize the code into reusable React components.

Suggested structure:

src/

  components/

    layout/

    ui/

    dashboard/

    attendance/

    leave/

    payroll/

    profile/

  pages/

  data/

  assets/

Avoid putting the entire application in one App.jsx file.

12. MOCK DATA

Create a dedicated mock data layer so that the UI can later be connected to the team's backend/API without redesigning the components.

Do NOT hardcode all data directly inside components.

13. UX DETAILS

Include:

- Loading states

- Empty states

- Hover states

- Active navigation states

- Form validation visuals

- Success/error feedback

- Tooltips where useful

- Accessible buttons and form labels

14. IMPORTANT VISUAL REQUIREMENT

The final interface should feel like a polished commercial HRMS product.

Do NOT make it look like:

- a basic Bootstrap dashboard

- a generic AI-generated template

- a school project

- a collection of unrelated cards

Use consistent spacing, typography, iconography, colors, borders, and interaction patterns throughout the entire application.

Start with the employee dashboard and overall layout first, then implement the other pages using the same design system.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/b14ed101-b72d-45aa-856f-94ec3c530c12).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
