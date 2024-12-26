export function getAuthorsData() {
  return {
    commits: {
      label: 'Commit',
      type: 'Commit',
      results: [
        {
          id: 'c1',
          message: 'Fixed a bug in the payment gateway',
          author: 'John Doe',
          date: '2024-12-25T10:00:00Z',
          repository: 'project-repo',
        },
        {
          id: 'c2',
          message: 'Improved database query performance',
          author: 'Jane Smith',
          date: '2024-12-24T14:30:00Z',
          repository: 'analytics-tool',
        },
      ],
      pagination: {
        page: 1,
        limit: 10,
        total: 2,
        totalPages: 1,
      },
    },
    pullRequests: {
      label: 'Pull Request',
      type: 'PullRequest',
      results: [
        {
          id: 'pr1',
          title: 'Add support for multi-language translations',
          author: 'Alex Brown',
          date: '2024-12-22T16:45:00Z',
          status: 'Merged',
        },
        {
          id: 'pr2',
          title: 'Fix UI responsiveness on mobile devices',
          author: 'Emily White',
          date: '2024-12-21T12:15:00Z',
          status: 'Open',
        },
      ],
      pagination: {
        page: 1,
        limit: 10,
        total: 2,
        totalPages: 1,
      },
    },
    issues: {
      label: 'Issue',
      type: 'Issue',
      results: [
        {
          id: 'i1',
          title: 'Crash on app startup',
          author: 'Chris Green',
          date: '2024-12-20T09:00:00Z',
          status: 'Open',
          priority: 'High',
        },
        {
          id: 'i2',
          title: 'Broken link in the user profile page',
          author: 'Patricia Black',
          date: '2024-12-19T11:20:00Z',
          status: 'Resolved',
          priority: 'Low',
        },
      ],
      pagination: {
        page: 1,
        limit: 10,
        total: 2,
        totalPages: 1,
      },
    },
  };
}

export function getOrganisation() {
  return {
    repositories: {
      label: 'Repository',
      type: 'Repository',
      results: [
        {
          id: 'r1',
          name: 'ecommerce-backend',
          description: 'Backend services for the eCommerce platform',
          owner: 'John Doe',
          createdAt: '2024-11-01T12:00:00Z',
          updatedAt: '2024-12-20T15:00:00Z',
        },
        {
          id: 'r2',
          name: 'frontend-ui-library',
          description: 'Reusable UI components for the frontend team',
          owner: 'Jane Smith',
          createdAt: '2024-10-15T08:30:00Z',
          updatedAt: '2024-12-18T14:00:00Z',
        },
      ],
      pagination: {
        page: 1,
        limit: 10,
        total: 2,
        totalPages: 1,
      },
    },
    authors: {
      label: 'Author',
      type: 'Author',
      results: [
        {
          id: 'a1',
          name: 'John Doe',
          email: 'john.doe@example.com',
          contributions: 152,
          lastActive: '2024-12-20T10:00:00Z',
        },
        {
          id: 'a2',
          name: 'Jane Smith',
          email: 'jane.smith@example.com',
          contributions: 98,
          lastActive: '2024-12-19T18:30:00Z',
        },
      ],
      pagination: {
        page: 1,
        limit: 10,
        total: 2,
        totalPages: 1,
      },
    },
  };
}

export function getPRList() {
  return {
    authors: {
      label: 'Author',
      results: [
        {
          id: 'a1',
          name: 'Alice Johnson',
          email: 'alice.johnson@example.com',
          commits: 250,
          lastActive: '2024-12-25T10:30:00Z',
        },
        {
          id: 'a2',
          name: 'Bob Smith',
          email: 'bob.smith@example.com',
          commits: 180,
          lastActive: '2024-12-24T18:45:00Z',
        },
      ],
      pagination: {
        page: 1,
        limit: 10,
        total: 2,
        totalPages: 1,
      },
    },
    repositories: {
      label: 'Repository',
      results: [
        {
          id: 'r1',
          name: 'project-management-app',
          description: 'A web app for managing projects and tasks.',
          owner: 'Alice Johnson',
          createdAt: '2024-01-15T14:00:00Z',
          updatedAt: '2024-12-23T09:00:00Z',
        },
        {
          id: 'r2',
          name: 'weather-forecast-api',
          description: 'API providing real-time weather forecasts.',
          owner: 'Bob Smith',
          createdAt: '2024-03-20T16:45:00Z',
          updatedAt: '2024-12-22T12:30:00Z',
        },
      ],
      pagination: {
        page: 1,
        limit: 10,
        total: 2,
        totalPages: 1,
      },
    },
    organisation: {
      label: 'Organisation',
      results: [
        {
          id: 'o1',
          name: 'Tech Innovations Inc.',
          location: 'San Francisco, CA',
          founded: '2015-06-10',
          members: 120,
          activeProjects: 15,
        },
        {
          id: 'o2',
          name: 'Global Solutions Ltd.',
          location: 'London, UK',
          founded: '2010-09-25',
          members: 250,
          activeProjects: 30,
        },
      ],
      pagination: {
        page: 1,
        limit: 10,
        total: 2,
        totalPages: 1,
      },
    },
  };
}

export function getCommitList() {
  return {
    author: {
      label: 'Author',
      results: [
        {
          id: 'a1',
          name: 'Alice Johnson',
          email: 'alice.johnson@example.com',
          commits: 250,
          lastActive: '2024-12-25T10:30:00Z',
        },
        {
          id: 'a2',
          name: 'Bob Smith',
          email: 'bob.smith@example.com',
          commits: 180,
          lastActive: '2024-12-24T18:45:00Z',
        },
      ],
      pagination: {
        page: 1,
        limit: 10,
        total: 2,
        totalPages: 1,
      },
    },
    repositories: {
      label: 'Repository',
      results: [
        {
          id: 'r1',
          name: 'project-management-app',
          description: 'A web app for managing projects and tasks.',
          owner: 'Alice Johnson',
          createdAt: '2024-01-15T14:00:00Z',
          updatedAt: '2024-12-23T09:00:00Z',
        },
        {
          id: 'r2',
          name: 'weather-forecast-api',
          description: 'API providing real-time weather forecasts.',
          owner: 'Bob Smith',
          createdAt: '2024-03-20T16:45:00Z',
          updatedAt: '2024-12-22T12:30:00Z',
        },
      ],
      pagination: {
        page: 1,
        limit: 10,
        total: 2,
        totalPages: 1,
      },
    },
    organisation: {
      label: 'Organisation',
      results: [
        {
          id: 'o1',
          name: 'Tech Innovations Inc.',
          location: 'San Francisco, CA',
          founded: '2015-06-10',
          members: 120,
          activeProjects: 15,
        },
        {
          id: 'o2',
          name: 'Global Solutions Ltd.',
          location: 'London, UK',
          founded: '2010-09-25',
          members: 250,
          activeProjects: 30,
        },
      ],
      pagination: {
        page: 1,
        limit: 10,
        total: 2,
        totalPages: 1,
      },
    },
  };
}

export function getIssuesList() {
  return {
    organisation: {
      label: 'Organisation',
      results: [
        {
          id: 'o1',
          name: 'Innovate Tech Ltd.',
          location: 'New York, USA',
          founded: '2012-05-15',
          employees: 200,
          activeProjects: 25,
        },
        {
          id: 'o2',
          name: 'NextGen Solutions',
          location: 'Berlin, Germany',
          founded: '2016-11-20',
          employees: 150,
          activeProjects: 18,
        },
      ],
      pagination: {
        page: 1,
        limit: 10,
        total: 2,
        totalPages: 1,
      },
    },
    author: {
      label: 'Author',
      results: [
        {
          id: 'a1',
          name: 'Alice Brown',
          email: 'alice.brown@example.com',
          commits: 350,
          lastActive: '2024-12-25T14:20:00Z',
        },
        {
          id: 'a2',
          name: 'John Doe',
          email: 'john.doe@example.com',
          commits: 275,
          lastActive: '2024-12-24T09:10:00Z',
        },
      ],
      pagination: {
        page: 1,
        limit: 10,
        total: 2,
        totalPages: 1,
      },
    },
    repositories: {
      label: 'Repository',
      results: [
        {
          id: 'r1',
          name: 'ai-analytics-platform',
          description: 'A platform for AI-driven data analytics.',
          owner: 'Alice Brown',
          createdAt: '2024-01-12T10:00:00Z',
          updatedAt: '2024-12-22T08:30:00Z',
        },
        {
          id: 'r2',
          name: 'ecommerce-app',
          description: 'A full-stack ecommerce application.',
          owner: 'John Doe',
          createdAt: '2024-03-05T15:20:00Z',
          updatedAt: '2024-12-21T14:45:00Z',
        },
      ],
      pagination: {
        page: 1,
        limit: 10,
        total: 2,
        totalPages: 1,
      },
    },
  };
}

export function getRepositoriesList() {
  return {
    organisation: {
      label: 'Organisation',
      results: [
        {
          id: 'o1',
          name: 'Innovate Tech Ltd.',
          location: 'New York, USA',
          founded: '2012-05-15',
          employees: 200,
          activeProjects: 25,
        },
        {
          id: 'o2',
          name: 'NextGen Solutions',
          location: 'Berlin, Germany',
          founded: '2016-11-20',
          employees: 150,
          activeProjects: 18,
        },
      ],
      pagination: {
        page: 1,
        limit: 10,
        total: 2,
        totalPages: 1,
      },
    },
    author: {
      label: 'Author',
      results: [
        {
          id: 'a1',
          name: 'Alice Brown',
          email: 'alice.brown@example.com',
          commits: 350,
          lastActive: '2024-12-25T14:20:00Z',
        },
        {
          id: 'a2',
          name: 'John Doe',
          email: 'john.doe@example.com',
          commits: 275,
          lastActive: '2024-12-24T09:10:00Z',
        },
      ],
      pagination: {
        page: 1,
        limit: 10,
        total: 2,
        totalPages: 1,
      },
    },
    repositories: {
      label: 'Repository',
      results: [
        {
          id: 'r1',
          name: 'ai-analytics-platform',
          description: 'A platform for AI-driven data analytics.',
          owner: 'Alice Brown',
          createdAt: '2024-01-12T10:00:00Z',
          updatedAt: '2024-12-22T08:30:00Z',
        },
        {
          id: 'r2',
          name: 'ecommerce-app',
          description: 'A full-stack ecommerce application.',
          owner: 'John Doe',
          createdAt: '2024-03-05T15:20:00Z',
          updatedAt: '2024-12-21T14:45:00Z',
        },
      ],
      pagination: {
        page: 1,
        limit: 10,
        total: 2,
        totalPages: 1,
      },
    },
  };
}

export function getSearchResult() {
  return {
    repositories: {
      label: 'Repository',
      type: 'Repository',
      results: [
        {
          id: 'repo1',
          name: 'AwesomeProject',
          description: 'A project showcasing best practices in development.',
          createdAt: '2022-01-15T12:00:00Z',
          language: 'JavaScript',
          stars: 150,
        },
        {
          id: 'repo2',
          name: 'DataVisualizer',
          description: 'A tool for visualizing complex data structures.',
          createdAt: '2023-06-10T08:45:00Z',
          language: 'Python',
          stars: 250,
        },
      ],
      pagination: {
        page: 1,
        limit: 10,
        total: 2,
        totalPages: 1,
      },
    },
    commits: {
      label: 'Commit',
      type: 'Commit',
      results: [
        {
          id: 'commit1',
          message: 'Initial commit with project setup.',
          author: 'Jane Doe',
          timestamp: '2024-12-22T10:15:00Z',
        },
        {
          id: 'commit2',
          message: 'Fixes for data visualization issues.',
          author: 'John Smith',
          timestamp: '2024-12-20T14:45:00Z',
        },
      ],
      pagination: {
        page: 1,
        limit: 10,
        total: 2,
        totalPages: 1,
      },
    },
    pullRequests: {
      results: [
        {
          id: 'pr1',
          title: 'Add support for dark mode.',
          author: 'Alice Johnson',
          createdAt: '2024-12-18T09:30:00Z',
          status: 'Open',
          reviews: 4,
        },
        {
          id: 'pr2',
          title: 'Optimize database queries.',
          author: 'Bob Lee',
          createdAt: '2024-12-17T11:20:00Z',
          status: 'Merged',
          reviews: 2,
        },
      ],
      pagination: {
        page: 1,
        limit: 10,
        total: 2,
        totalPages: 1,
      },
    },
    issues: {
      label: 'Issue',
      results: [
        {
          id: 'issue1',
          title: 'Error handling for API responses.',
          author: 'Jane Doe',
          createdAt: '2024-12-19T08:20:00Z',
          status: 'Open',
          priority: 'High',
        },
        {
          id: 'issue2',
          title: 'UI alignment issue in mobile view.',
          author: 'John Smith',
          createdAt: '2024-12-18T15:00:00Z',
          status: 'Closed',
          priority: 'Low',
        },
      ],
      pagination: {
        page: 1,
        limit: 10,
        total: 2,
        totalPages: 1,
      },
    },
  };
}

export function getEntities() {
  return {
    results: [
      {
        _id: 1,
        type: 'Organisation',
        Label: 'Organisation',
        createdAt: '2023-03-01T00:00:00.000Z',
        updatedAt: '2023-03-01T00:00:00.000Z',
      },
      {
        _id: 2,
        type: 'Author',
        Label: 'Author',
        createdAt: '2023-03-01T00:00:00.000Z',
        updatedAt: '2023-03-01T00:00:00.000Z',
      },
      {
        _id: 3,
        type: 'Repository',
        Label: 'Repository',
        createdAt: '2023-03-01T00:00:00.000Z',
        updatedAt: '2023-03-01T00:00:00.000Z',
      },
      {
        _id: 4,
        type: 'PullRequest',
        Label: 'Pull Request',
        createdAt: '2023-03-01T00:00:00.000Z',
        updatedAt: '2023-03-01T00:00:00.000Z',
      },
      {
        _id: 5,
        type: 'Commit',
        Label: 'Commit',
        createdAt: '2023-03-01T00:00:00.000Z',
        updatedAt: '2023-03-01T00:00:00.000Z',
      },
      {
        _id: 6,
        type: 'Issue',
        Label: 'Issue',
        createdAt: '2023-03-01T00:00:00.000Z',
        updatedAt: '2023-03-01T00:00:00.000Z',
      },
    ],
  };
}
