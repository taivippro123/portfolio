import { API_URL } from "@/config/api"

const getAuthHeaders = () => {
  const token = localStorage.getItem("token")
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  }
}

// Folders API
export const foldersApi = {
  getAll: async () => {
    const response = await fetch(`${API_URL}/api/folders`, {
      headers: getAuthHeaders(),
    })
    if (!response.ok) throw new Error("Failed to fetch folders")
    return response.json()
  },

  create: async (name: string) => {
    const response = await fetch(`${API_URL}/api/folders`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ name }),
    })
    if (!response.ok) throw new Error("Failed to create folder")
    return response.json()
  },

  update: async (id: string, name: string, isShared?: boolean) => {
    const response = await fetch(`${API_URL}/api/folders/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify({ name, isShared }),
    })
    if (!response.ok) throw new Error("Failed to update folder")
    return response.json()
  },

  toggleShare: async (id: string, isShared: boolean) => {
    const response = await fetch(`${API_URL}/api/folders/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify({ isShared }),
    })
    if (!response.ok) throw new Error("Failed to toggle share")
    return response.json()
  },

  delete: async (id: string) => {
    const response = await fetch(`${API_URL}/api/folders/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    })
    if (!response.ok) throw new Error("Failed to delete folder")
    return response.json()
  },
}

// Notes API
export const notesApi = {
  getAll: async (folderId?: string) => {
    let url = `${API_URL}/api/notes`
    if (folderId) {
      url += `?folderId=${folderId}`
    }
    const response = await fetch(url, {
      headers: getAuthHeaders(),
    })
    if (!response.ok) throw new Error("Failed to fetch notes")
    return response.json()
  },

  getById: async (id: string) => {
    const response = await fetch(`${API_URL}/api/notes/${id}`, {
      headers: getAuthHeaders(),
    })
    if (!response.ok) throw new Error("Failed to fetch note")
    return response.json()
  },

  create: async (data: { title: string; content?: string; folderId?: string }) => {
    const response = await fetch(`${API_URL}/api/notes`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    })
    if (!response.ok) throw new Error("Failed to create note")
    return response.json()
  },

  update: async (id: string, data: { title: string; content?: string; folderId?: string; isShared?: boolean }) => {
    const response = await fetch(`${API_URL}/api/notes/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    })
    if (!response.ok) throw new Error("Failed to update note")
    return response.json()
  },

  toggleShare: async (id: string, isShared: boolean) => {
    const response = await fetch(`${API_URL}/api/notes/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify({ isShared }),
    })
    if (!response.ok) throw new Error("Failed to toggle share")
    return response.json()
  },

  delete: async (id: string) => {
    const response = await fetch(`${API_URL}/api/notes/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    })
    if (!response.ok) throw new Error("Failed to delete note")
    return response.json()
  },
}

// CV API
export const cvApi = {
  getPublic: async () => {
    const response = await fetch(`${API_URL}/api/cv/public`, {
      headers: { "Content-Type": "application/json" },
    })
    if (!response.ok) throw new Error("Failed to fetch CV")
    return response.json()
  },

  upload: async (file: File) => {
    const formData = new FormData()
    formData.append("file", file)
    const token = localStorage.getItem("token")
    const response = await fetch(`${API_URL}/api/cv`, {
      method: "POST",
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    })
    if (!response.ok) throw new Error("Failed to upload CV")
    return response.json()
  },

  getMyCV: async () => {
    const response = await fetch(`${API_URL}/api/cv`, {
      headers: getAuthHeaders(),
    })
    if (!response.ok) throw new Error("Failed to fetch CV")
    return response.json()
  },

  delete: async () => {
    const response = await fetch(`${API_URL}/api/cv`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    })
    if (!response.ok) throw new Error("Failed to delete CV")
    return response.json()
  },
}

// Analytics API
export const analyticsApi = {
  getCV: async (page: number = 1, limit: number = 15) => {
    const response = await fetch(`${API_URL}/api/analytics/cv?page=${page}&limit=${limit}`, {
      headers: getAuthHeaders(),
    })
    if (!response.ok) throw new Error("Failed to fetch analytics")
    return response.json()
  },
}

// Share API (Public)
export const shareApi = {
  getSharedContent: async () => {
    const response = await fetch(`${API_URL}/api/share`, {
      headers: { "Content-Type": "application/json" },
    })
    if (!response.ok) throw new Error("Failed to fetch shared content")
    return response.json()
  },
}

// Upload API
export const uploadApi = {
  upload: async (file: File) => {
    const formData = new FormData()
    formData.append("file", file)
    const token = localStorage.getItem("token")
    const response = await fetch(`${API_URL}/api/upload`, {
      method: "POST",
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    })
    if (!response.ok) throw new Error("Failed to upload file")
    return response.json()
  },

  delete: async (cloudinaryId: string) => {
    const response = await fetch(`${API_URL}/api/upload`, {
      method: "DELETE",
      headers: getAuthHeaders(),
      body: JSON.stringify({ cloudinaryId }),
    })
    if (!response.ok) throw new Error("Failed to delete file")
    return response.json()
  },
}

