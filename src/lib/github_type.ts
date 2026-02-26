// github-types.ts

// =====================
// GitHub User
// =====================
export interface GitHubUser {
    login: string;
    id: number;
    avatar_url: string;
    html_url: string;
    type: "User" | "Organization";
}

// =====================
// Repo Permissions
// =====================
export interface RepoPermissions {
    admin: boolean;
    maintain: boolean;
    push: boolean;
    triage: boolean;
    pull: boolean;
}

// =====================
// Main Repository Type
// =====================
export interface GitHubRepository {
    id: number;
    name: string;
    full_name: string;

    private: boolean;
    fork: boolean;
    archived: boolean;
    disabled: boolean;

    owner: GitHubUser;

    html_url: string;
    clone_url: string;
    ssh_url: string;

    description: string | null;
    homepage: string | null;
    language: string | null;
    topics: string[];

    default_branch: string;

    created_at: string;
    updated_at: string;
    pushed_at: string;

    size: number;

    stargazers_count: number;
    watchers_count: number;
    forks_count: number;
    open_issues_count: number;

    visibility: "public" | "private" | "internal";

    has_issues: boolean;
    has_projects: boolean;
    has_wiki: boolean;
    has_pages: boolean;
    has_discussions: boolean;

    permissions: RepoPermissions;
}

// =====================
// Function to list repos
// =====================
export async function listRepos(accessToken: string): Promise<GitHubRepository[]> {
    const repos: GitHubRepository[] = [];
    let page = 1;

    while (true) {
        const res = await fetch(
            `https://api.github.com/user/repos?per_page=100&page=${page}&sort=updated`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    Accept: "application/vnd.github+json",
                    "X-GitHub-Api-Version": "2022-11-28",
                },
            }
        );

        if (!res.ok) {
            const text = await res.text();
            throw new Error(`GitHub API error ${res.status}: ${text}`);
        }

        const batch: GitHubRepository[] = await res.json();
        if (!batch.length) break;

        repos.push(...batch);
        page++;
    }

    return repos;
}

// =====================
// Example Usage
// =====================
// const token = "YOUR_GITHUB_TOKEN";
// listRepos(token).then(repos => console.log(repos));
