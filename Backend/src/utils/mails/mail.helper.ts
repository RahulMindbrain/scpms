export const resolveParticipants = (schedule) => {
  return {
    adminId: schedule.createdBy,
    adminEmail: schedule.admin.user.email,
    adminName: schedule.admin.user.firstname,

    companyUserId: schedule.company.userId,
    companyEmail: schedule.company.user.email,
    companyName: schedule.company.name,
  };
};

export const resolveDirection = (senderId, participants) => {
  if (senderId === participants.adminId) {
    return {
      senderRole: "ADMIN",
      senderName: participants.adminName,
      recipientEmail: participants.companyEmail,
    };
  }

  if (senderId === participants.companyUserId) {
    return {
      senderRole: "COMPANY",
      senderName: participants.companyName,
      recipientEmail: participants.adminEmail,
    };
  }

  throw new Error("Unauthorized user for this schedule");
};
