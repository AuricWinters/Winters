import { defineStore } from 'pinia';
import profileData from '../data/profile.json';
import projectsData from '../data/projects.json';
import blogsData from '../data/blogs.json';

export const useDataStore = defineStore('data', {
  state: () => ({
    profile: profileData,
    projects: projectsData,
    blogs: blogsData,
  }),
  getters: {
    latestBlogs: (state) => state.blogs.slice(0, 3),
    featuredProjects: (state) => state.projects.slice(0, 2)
  }
});
