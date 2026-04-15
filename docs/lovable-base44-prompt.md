# Prompt for Lovable / Base44

Build a SaaS platform called **Athlon Agent** with a **single shared authentication system** and **role-based routing**.

Users can sign up as:
- Athlete
- Agent
- Agency Admin

After login:
- Athletes see an athlete dashboard with tasks, calendar, deals, files, and profile.
- Agents see an agent dashboard with assigned athlete roster, deal tracking, task management, calendar, documents, and athlete profile pages.
- Agency Admins can also manage team members, invites, permissions, and billing.

Use a shared database with these core tables:
- users
- profiles
- agencies
- agency_members
- athletes
- agent_athlete_relationships

Add feature tables:
- tasks
- deals
- events
- documents
- notifications

Authorization requirements:
- Athletes can only access their own records or explicitly shared records.
- Agents can only access athletes connected to their agency and relationship assignments.
- Agency Admins can access/manage all records inside their agency.

Enforce permissions both:
- at route level (frontend)
- at data level (backend policies/RLS)

Design language:
- Modern, premium, sports-business feel
- Clean dashboards and clear role-specific navigation
- Keep MVP tight and extensible
