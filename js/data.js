
/* ===== MOCK DATA: occupational details are modelled on O*NET fields, not live O*NET. rc = mock Holland (RIASEC) interest codes. ===== */

const careers = {
    ds: {
        id: 'ds',
        rc: ['I', 'C', 'A'],
        short: 'Data Scientist',
        soc: '15-2051.00',
        title: 'Data Scientist',
        score: 68,
        domain: 'Data',
        edu: "Bachelor's degree (Job Zone 4)",
        desc: 'Develop and implement methods to extract insight from large data sets using statistics, programming and machine learning.',
        req: {
            Python: 4,
            SQL: 3,
            Statistics: 4,
            'Machine Learning': 4,
            'Cloud Computing': 3,
            'Data Visualization': 3
        },
        tasks: [
            'Analyze data to identify patterns and trends',
            'Build and validate predictive models',
            'Communicate findings to stakeholders'
        ],
        tech: ['Python', 'SQL', 'TensorFlow', 'Tableau'],
        ctx: [
            'Analytical, mostly desk-based work',
            'Frequent collaboration with teams'
        ],
        why: [
            'Strong Python proficiency',
            'SQL experience',
            'Relevant project: Music Genre Classification',
            'Interest in Data Science & ML'
        ],
        rel: ['Business Intelligence Analysts', 'Statisticians']
    },

    swd: {
        id: 'swd',
        rc: ['I', 'R', 'C'],
        short: 'Software Developer',
        soc: '15-1252.00',
        title: 'Software Developer',
        score: 76,
        domain: 'Software',
        edu: "Bachelor's degree (Job Zone 4)",
        desc: 'Design, develop and test software applications and systems.',
        req: {
            Python: 3,
            Java: 4,
            JavaScript: 3,
            Git: 3,
            SQL: 3,
            'Cloud Computing': 3
        },
        tasks: [
            'Write and test code',
            'Analyze user needs',
            'Maintain and debug existing systems'
        ],
        tech: ['Java', 'JavaScript', 'Git', 'Docker'],
        ctx: ['Team-based, structured work'],
        why: [
            'Java and JavaScript experience',
            'Git proficiency',
            'Project: Stock Trading Platform'
        ],
        rel: ['Web Developers', 'QA Analysts']
    },

    bi: {
        id: 'bi',
        rc: ['C', 'E', 'I'],
        short: 'BI Analyst',
        soc: '15-2051.01',
        title: 'Business Intelligence Analyst',
        score: 72,
        domain: 'Data',
        edu: "Bachelor's degree (Job Zone 4)",
        desc: 'Produce financial and market intelligence by querying data and presenting analysis.',
        req: {
            SQL: 4,
            'Data Visualization': 4,
            Statistics: 3,
            Python: 2
        },
        tasks: [
            'Query and clean data',
            'Build dashboards and reports'
        ],
        tech: ['SQL', 'Tableau', 'Power BI'],
        ctx: ['Analytical, business-facing work'],
        why: [
            'Strong SQL',
            'Python for analysis'
        ],
        rel: ['Data Scientists']
    },

    cirs: {
        id: 'cirs',
        rc: ['I', 'A', 'R'],
        short: 'Research Scientist',
        soc: '15-1221.00',
        title: 'Computer & Information Research Scientist',
        score: 55,
        domain: 'Research',
        edu: "Master's or doctoral degree (Job Zone 5)",
        desc: 'Conduct research into fundamental computer and information science problems.',
        req: {
            'Machine Learning': 5,
            Statistics: 4,
            Python: 4,
            Mathematics: 4
        },
        tasks: [
            'Design experiments',
            'Publish research findings'
        ],
        tech: ['Python', 'TensorFlow'],
        ctx: ['Research-oriented'],
        why: [
            'Interest in Machine Learning',
            'Python proficiency'
        ],
        rel: ['Data Scientists']
    }
};

const blank = () => ({
    name: '',
    email: '',
    edu: '',
    rs: Array(18).fill(0),
    goal: {
        domain: '',
        work: '',
        higher: '',
        text: ''
    },
    skills: {},
    resume: null,
    projects: [],
    links: {
        github: '',
        linkedin: '',
        leetcode: ''
    }
});

let profile = blank();

const SKILLS = [
    'Python',
    'SQL',
    'Java',
    'JavaScript',
    'Git',
    'Machine Learning',
    'Statistics',
    'Cloud Computing',
    'Data Visualization',
    'Mathematics'
];

const LV = [
    '',
    'Beginner',
    'Basic',
    'Intermediate',
    'Advanced',
    'Expert'
];

const RC = {
    R: 'Realistic',
    I: 'Investigative',
    A: 'Artistic',
    S: 'Social',
    E: 'Enterprising',
    C: 'Conventional'
};

const RD = {
    R: 'Hands-on work with tools, machines or systems',
    I: 'Analysing, researching and solving complex problems',
    A: 'Creative, original and expressive work',
    S: 'Helping, teaching and working with people',
    E: 'Leading, persuading and starting ventures',
    C: 'Organised, detail-focused and rule-based work'
};

const LK = [
    'Strongly dislike',
    'Dislike',
    'Neutral',
    'Like',
    'Strongly like'
];

/* 18 RIASEC items: 3 per category, shown in this order */
const RQ = [
    ['R', 'Repair or build things with tools or equipment'],
    ['I', 'Work through complex problems by analysing data'],
    ['A', 'Create original designs, writing or music'],
    ['S', 'Teach or help people learn something new'],
    ['E', 'Lead a team toward a business goal'],
    ['C', 'Organise records and keep systems accurate'],

    ['R', 'Set up and troubleshoot hardware or networks'],
    ['I', 'Run experiments to test an idea'],
    ['A', 'Express ideas through visual or creative work'],
    ['S', 'Support people through personal or work challenges'],
    ['E', 'Persuade others to back your proposal'],
    ['C', 'Follow clear procedures to get precise results'],

    ['R', 'Work hands-on rather than only at a desk'],
    ['I', 'Read research papers to understand how things work'],
    ['A', 'Come up with unconventional solutions'],
    ['S', 'Work in a team where helping others is the main goal'],
    ['E', 'Start or run a project of your own'],
    ['C', 'Prepare detailed reports, spreadsheets or schedules']
];