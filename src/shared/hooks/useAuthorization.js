import useAuthStore from '../stores/authStore';

const useAuthorization = () => {
  const { isAuthenticated, getUser } = useAuthStore();
  const user = getUser();

  const hasRole = (allowedRoles) => {
    if (!isAuthenticated || !user) return false;
    return allowedRoles.includes(user.role);
  };

  const isCandidate = () => hasRole(['CANDIDATE']);
  const isRecruiter = () => hasRole(['RECRUITER']);
  const isAdmin = () => hasRole(['GRADCONNECT']);

  const canAccessCandidatePages = () => hasRole(['CANDIDATE', 'RECRUITER', 'GRADCONNECT']);
  const canAccessRecruiterPages = () => hasRole(['RECRUITER']);
  const canAccessAdminPages = () => hasRole(['GRADCONNECT']);

  return {
    isAuthenticated,
    user,
    userRole: user?.role,
    hasRole,
    isCandidate,
    isRecruiter,
    isAdmin,
    canAccessCandidatePages,
    canAccessRecruiterPages,
    canAccessAdminPages
  };
};

export default useAuthorization; 