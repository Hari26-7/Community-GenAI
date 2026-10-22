import json

INITIAL_SCHEMES = [
    {
        "id": "pmegp-001",
        "name": "Prime Minister's Employment Generation Programme (PMEGP)",
        "description": "Credit-linked subsidy programme aimed at generating self-employment opportunities through establishment of micro-enterprises in non-farm sector.",
        "category": "Credit & Financial Assistance",
        "ministry": "Ministry of MSME / KVIC",
        "max_benefit_amount": 5000000.0,
        "subsidy_percent": 35.0,
        "eligibility_criteria": [
            "Any individual above 18 years of age",
            "At least VIII standard pass for projects costing above Rs.10 lakh in manufacturing and Rs.5 lakh in services",
            "Only for new micro enterprise projects",
            "Self Help Groups (SHGs) not availing other benefits"
        ],
        "required_documents": [
            "Aadhaar Card",
            "PAN Card",
            "Project Report (DPR)",
            "Educational Qualification Certificate",
            "Caste/Special Category Certificate (if applicable)",
            "Rural Area Certificate (if applicable)"
        ],
        "application_link": "https://www.kviconline.gov.in/pmegpeportal/",
        "is_active": True
    },
    {
        "id": "mudra-002",
        "name": "Pradhan Mantri Mudra Yojana (PMMY)",
        "description": "Collateral-free institutional credit up to Rs. 10 Lakhs to micro/small business enterprises in manufacturing, trading, and services.",
        "category": "Credit & Financial Assistance",
        "ministry": "Ministry of Finance / MSME",
        "max_benefit_amount": 1000000.0,
        "subsidy_percent": 0.0,
        "eligibility_criteria": [
            "Non-corporate, non-farm small/micro enterprises",
            "Valid business plan for manufacturing, processing, trading, or service activities",
            "No default record in any bank/financial institution",
            "Shishu (up to 50k), Kishore (50k - 5L), Tarun (5L - 10L)"
        ],
        "required_documents": [
            "Identity Proof (Aadhaar / Voter ID / Passport)",
            "Residence Proof",
            "Business Address Proof",
            "Bank Statement (last 6 months)",
            "Quotation / Machinery purchase estimate"
        ],
        "application_link": "https://www.mudra.org.in/",
        "is_active": True
    },
    {
        "id": "cgtmse-003",
        "name": "Credit Guarantee Scheme (CGTMSE)",
        "description": "Credit guarantee coverage up to Rs. 500 Lakhs (5 Crore) to enable collateral-free credit flow to Micro and Small Enterprises.",
        "category": "Credit & Financial Assistance",
        "ministry": "Ministry of MSME / SIDBI",
        "max_benefit_amount": 50000000.0,
        "subsidy_percent": 85.0,
        "eligibility_criteria": [
            "New and existing Micro and Small Enterprises",
            "Manufacturing and Service sectors including retail trade and educational institutions",
            "Borrower should have viable business model without third-party collateral"
        ],
        "required_documents": [
            "Udyam Registration Certificate",
            "ITR Documents for last 2 years",
            "Audited Balance Sheet & P&L Statement",
            "Detailed Project Report (DPR)",
            "GST Returns"
        ],
        "application_link": "https://www.cgtmse.in/",
        "is_active": True
    },
    {
        "id": "pm-vishwakarma-004",
        "name": "PM Vishwakarma Scheme",
        "description": "Holistic support to traditional artisans and craftspeople with toolkit incentives, training stipend, and low-interest collateral-free loans.",
        "category": "Skill & Training",
        "ministry": "Ministry of MSME",
        "max_benefit_amount": 300000.0,
        "subsidy_percent": 100.0,
        "eligibility_criteria": [
            "Artisans working with hands and tools in 18 identified traditional trades (Carpenters, Blacksmiths, Potters, Tailors, etc.)",
            "Minimum age of 18 years on the date of registration",
            "Beneficiary should be engaged in the trade on the date of application",
            "One member per family eligible"
        ],
        "required_documents": [
            "Aadhaar Card",
            "Mobile Number linked with Aadhaar",
            "Bank Account Details",
            "Ration Card (mandatory for family verification)"
        ],
        "application_link": "https://pmvishwakarma.gov.in/",
        "is_active": True
    },
    {
        "id": "zed-005",
        "name": "MSME Sustainable (ZED) Certification Scheme",
        "description": "Financial assistance on cost of Zero Defect Zero Effect (ZED) assessment and certification to promote quality manufacturing and environmental standards.",
        "category": "Infrastructure & Tech",
        "ministry": "Ministry of MSME",
        "max_benefit_amount": 500000.0,
        "subsidy_percent": 80.0,
        "eligibility_criteria": [
            "All Manufacturing MSMEs with valid Udyam Registration",
            "Subsidy structure: Micro (80%), Small (60%), Medium (50%)",
            "Additional 10% subsidy for Women / SC / ST / NER entrepreneurs"
        ],
        "required_documents": [
            "Udyam Registration Certificate",
            "Plant & Machinery Investment Undertaking",
            "Electricity Bill / Factory License",
            "Bank Statement"
        ],
        "application_link": "https://zed.msme.gov.in/",
        "is_active": True
    },
    {
        "id": "standup-006",
        "name": "Stand-Up India Scheme",
        "description": "Bank loans between Rs. 10 Lakhs and Rs. 1 Crore to at least one Scheduled Caste (SC) or Scheduled Tribe (ST) borrower and at least one woman borrower per bank branch.",
        "category": "Credit & Financial Assistance",
        "ministry": "Ministry of Finance",
        "max_benefit_amount": 10000000.0,
        "subsidy_percent": 15.0,
        "eligibility_criteria": [
            "SC/ST and/or Woman entrepreneurs above 18 years of age",
            "Only for Greenfield (first-time venture) projects",
            "In non-individual enterprises, 51% shareholding should be held by SC/ST and/or women",
            "Manufacturing, services, agri-allied or trading sectors"
        ],
        "required_documents": [
            "Identity & Address Proof",
            "Caste Certificate (for SC/ST)",
            "Project Report",
            "Partnership Deed / MoA / AoA (if corporate)",
            "Pollution clearance / licenses if applicable"
        ],
        "application_link": "https://www.standupmitra.in/",
        "is_active": True
    },
    {
        "id": "sfurti-007",
        "name": "SFURTI (Fund for Regeneration of Traditional Industries)",
        "description": "Cluster development grant to make traditional industries more productive, competitive, and sustainable through modern equipment and Common Facility Centres.",
        "category": "Infrastructure & Tech",
        "ministry": "Ministry of MSME",
        "max_benefit_amount": 50000000.0,
        "subsidy_percent": 90.0,
        "eligibility_criteria": [
            "Non-Government Organizations (NGOs), Institutions of Central/State Govt, SHGs, Panchayati Raj Institutions",
            "Artisan clusters with minimum 500 artisans for regular clusters and 2500 for major clusters"
        ],
        "required_documents": [
            "Detailed Project Report (DPR)",
            "Registration Documents of Nodal Agency / Implementing Agency",
            "Land Availability Proof for Common Facility Centre (CFC)",
            "Artisan baseline survey list"
        ],
        "application_link": "https://sfurti.msme.gov.in/",
        "is_active": True
    }
]

DEFAULT_ROADMAP_STEPS = [
    {
        "step_number": 1,
        "title": "Udyam Registration & Document Preparation",
        "description": "Obtain your 19-digit Udyam Registration Number using Aadhaar and PAN. Ensure GST certificate and bank accounts are active.",
        "status": "pending",
        "action_link": "https://udyamregistration.gov.in/"
    },
    {
        "step_number": 2,
        "title": "Credit Profiling & CIBIL Readiness",
        "description": "Check MSME credit score, clear any overdue payments, and maintain regular bank cash-flow records.",
        "status": "pending",
        "action_link": "/credit-score"
    },
    {
        "step_number": 3,
        "title": "Detailed Project Report (DPR) Formulation",
        "description": "Draft complete financial appraisal, project cost, debt-equity ratio, machinery quotations, and break-even projection.",
        "status": "pending",
        "action_link": "/documents"
    },
    {
        "step_number": 4,
        "title": "AI Scheme Matching & Stacking Verification",
        "description": "Use MSME Sahayak to identify optimal non-conflicting subsidies and collateral guarantee combinations.",
        "status": "pending",
        "action_link": "/scheme-matching"
    },
    {
        "step_number": 5,
        "title": "Official Portal Application & Bank Sanction",
        "description": "Submit digital application on national portal (PMEGP / Mudra / CGTMSE) and track bank branch processing.",
        "status": "pending",
        "action_link": "/applications"
    }
]

INITIAL_COMMUNITY_ISSUES = [
    {
        "id": "iss-001",
        "title": "Frequent waste collection delays in Ward 7 & Market Area",
        "description": "Garbage trucks have been skipping Tuesday & Friday collection cycles, leading to overflow around the central produce market and residential lanes.",
        "category": "Sanitation & Waste",
        "location": "Ward 7, North Market Block",
        "priority": "High",
        "status": "In Progress",
        "created_by": "Ramesh Kumar",
        "created_at": "2026-10-20T09:30:00Z",
        "updated_at": "2026-10-21T14:15:00Z"
    },
    {
        "id": "iss-002",
        "title": "Street light outage near Community Primary Health Center",
        "description": "Four sequential street poles along Health Center Road have non-functioning sodium vapor lamps, causing safety hazards for night clinic visitors.",
        "category": "Infrastructure & Energy",
        "location": "Health Center Road, Sector 3",
        "priority": "Medium",
        "status": "Open",
        "created_by": "Ananya Sharma",
        "created_at": "2026-10-21T11:45:00Z",
        "updated_at": "2026-10-21T11:45:00Z"
    },
    {
        "id": "iss-003",
        "title": "Potable water supply pressure drop in Cooperative Housing Colony",
        "description": "Morning municipal pipeline delivery pressure dropped by 60% after recent underground cable trenching works.",
        "category": "Water Supply",
        "location": "Cooperative Colony Block B",
        "priority": "Critical",
        "status": "Open",
        "created_by": "Karthik Rajan",
        "created_at": "2026-10-22T07:15:00Z",
        "updated_at": "2026-10-22T08:00:00Z"
    },
    {
        "id": "iss-004",
        "title": "Potholes and drainage overflow along Main Bazaar Road",
        "description": "Monsoon runoff caused localized drainage blockage near the agricultural input stores, leading to stagnant water pooling.",
        "category": "Civic Works",
        "location": "Main Bazaar Road",
        "priority": "Medium",
        "status": "Resolved",
        "created_by": "Deepak Patel",
        "created_at": "2026-10-18T16:20:00Z",
        "updated_at": "2026-10-20T17:30:00Z"
    }
]

INITIAL_COMMUNITY_DISCUSSIONS = [
    {
        "id": "disc-001",
        "title": "Organizing weekend volunteer cleanup drive for Central Community Park",
        "content": "Looking to assemble 25-30 community volunteers this Saturday morning from 7 AM to 10 AM. Gloves, garbage bags, and compost sorting bins will be provided.",
        "category": "Volunteering",
        "author": "Ananya Sharma",
        "replies_count": 14,
        "created_at": "2026-10-21T10:00:00Z"
    },
    {
        "id": "disc-002",
        "title": "Solar micro-grid feasibility for local dairy cooperative & cold chain",
        "content": "We are evaluating rooftop solar plus battery backup to ensure uninterrupted milk chilling during summer power cuts. Has any neighboring SHG implemented PM-KUSUM or NABARD solar subsidies?",
        "category": "Clean Energy",
        "author": "Ramesh Kumar",
        "replies_count": 9,
        "created_at": "2026-10-20T14:30:00Z"
    },
    {
        "id": "disc-003",
        "title": "Setting up a decentralized vermicomposting pit for vegetable market waste",
        "content": "Proposed plan to divert 300kg of daily vegetable market trimmings into organic vermicompost to sell to local nursery growers.",
        "category": "Sustainability",
        "author": "Priya Sundaram",
        "replies_count": 6,
        "created_at": "2026-10-19T11:15:00Z"
    }
]

INITIAL_COMMUNITY_ANNOUNCEMENTS = [
    {
        "id": "ann-001",
        "title": "Free Health Checkup and Aadhaar Verification Camp this Saturday",
        "body": "The Community Primary Health Center in partnership with District e-Seva is hosting a free multi-specialty screening and Aadhaar biometric update camp on Saturday, Oct 25 from 9:00 AM to 4:00 PM.",
        "audience": "All Residents",
        "category": "Public Health",
        "created_at": "2026-10-21T09:00:00Z"
    },
    {
        "id": "ann-002",
        "title": "Municipal Water Pipeline Maintenance Schedule for Sector 3 & 4",
        "body": "Please be advised that municipal water supply will operate on a modified morning-only schedule on Thursday while scheduled pipe joint replacements are executed.",
        "audience": "Residents & MSMEs",
        "category": "Civic Works",
        "created_at": "2026-10-20T15:00:00Z"
    }
]

INITIAL_COMMUNITY_ACTIVITIES = [
    {
        "id": "act-001",
        "type": "issue_status_changed",
        "description": "Issue 'Frequent waste collection delays' status updated to In Progress",
        "user_name": "Ramesh Kumar",
        "timestamp": "2026-10-22T15:30:00Z",
        "metadata_json": "{\"issue_id\":\"iss-001\",\"status\":\"In Progress\"}"
    },
    {
        "id": "act-002",
        "type": "ai_problem_analyzed",
        "description": "AI analyzed community problem: 'Decentralized Composting for Market Waste'",
        "user_name": "Community Sahayak AI",
        "timestamp": "2026-10-22T14:10:00Z",
        "metadata_json": "{\"category\":\"Sanitation\"}"
    },
    {
        "id": "act-003",
        "type": "ai_solution_generated",
        "description": "AI generated 3 practical solutions for 'Rural Micro-Cold Storage Feasibility'",
        "user_name": "Community Sahayak AI",
        "timestamp": "2026-10-22T11:45:00Z",
        "metadata_json": "{\"options_count\":3}"
    },
    {
        "id": "act-004",
        "type": "announcement_published",
        "description": "Announcement published: 'Free Health Checkup and Aadhaar Camp'",
        "user_name": "Health Center Committee",
        "timestamp": "2026-10-21T09:00:00Z",
        "metadata_json": "{\"ann_id\":\"ann-001\"}"
    },
    {
        "id": "act-005",
        "type": "member_joined",
        "description": "New Community Member registered: Ramesh Kumar",
        "user_name": "System",
        "timestamp": "2026-10-20T10:15:00Z",
        "metadata_json": "{\"role\":\"Community Leader\"}"
    }
]
