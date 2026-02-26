
interface GHResponse<T = any> {
    res: Response;
    text: string;
    json: T | null;
}

interface GitHubRepo {
    default_branch: string;
    name: string;
    full_name: string;
    private: boolean;
    [key: string]: any;
}

const token: string | undefined = undefined; // Optional: GitHub token

async function gh<T = any>(url: string): Promise<GHResponse<T>> {
    const res = await fetch(url, {
        redirect: "follow",
        headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            Accept: "application/vnd.github+json",
            "X-GitHub-Api-Version": "2022-11-28",
            "User-Agent": "minicloud_app",
        },
    });

    const text = await res.text();
    let json: T | null = null;

    try {
        json = JSON.parse(text) as T;
    } catch { }

    return { res, text, json };
}

export async function downloadZip(owner: string, repo: string): Promise<void> {
    // Step A: get repo info
    const repoCheck = await gh<GitHubRepo>(`https://api.github.com/repos/${owner}/${repo}`);

    if (!repoCheck.res.ok || !repoCheck.json) {
        console.error("Repo check failed:", repoCheck.text);
        throw new Error("Cannot access repo.");
    }

    const defaultBranch = repoCheck.json.default_branch;

    // Step B: download zip as blob
    const zipUrl = `https://api.github.com/repos/${owner}/${repo}/zipball/${encodeURIComponent(defaultBranch)}`;
    const zipRes = await fetch(zipUrl, {
        redirect: "follow",
        headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            "X-GitHub-Api-Version": "2022-11-28",
            "User-Agent": "minicloud_app",
        },
    });

    if (!zipRes.ok) {
        const errText = await zipRes.text();
        throw new Error(`Zip download failed: ${zipRes.status} - ${errText}`);
    }

    const blob = await zipRes.blob();
    const blobUrl = URL.createObjectURL(blob);

    // Trigger download in browser
    const a = document.createElement("a");
    a.href = blobUrl;
    a.download = `${owner}-${repo}-${defaultBranch}.zip`;
    a.click();
    URL.revokeObjectURL(blobUrl);
}

