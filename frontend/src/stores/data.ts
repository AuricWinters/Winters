import { defineStore } from 'pinia';
import profileData from '../data/profile.json';
import projectsData from '../data/projects.json';
import blogsData from '../data/blogs.json';

interface Profile {
  name?: string;
  bio?: string;
  avatar?: string;
  [key: string]: any;
}

interface Project {
  id: number;
  title: string;
  description: string;
  [key: string]: any;
}

interface Blog {
  id: number;
  title: string;
  date: string;
  [key: string]: any;
}

export const useDataStore = defineStore('data', {
  state: (): { profile: Profile; projects: Project[]; blogs: Blog[] } => ({
    profile: profileData as Profile,
    projects: projectsData as Project[],
    blogs: blogsData as Blog[],
  }),
  getters: {
    latestBlogs: (state): Blog[] => state.blogs.slice(0, 3),
    featuredProjects: (state): Project[] => state.projects.slice(0, 2)
  }
});
