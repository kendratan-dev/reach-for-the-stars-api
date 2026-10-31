module.exports = {
  // Session joining & seats
  uq_session_user_seat: {
    status: 409,
    code: 'ALREADY_IN_SESSION',
    message: 'You have already joined this session.'
  },
  sessions_join_code_key: {
    status: 409,
    code: 'DUPLICATE_JOIN_CODE',
    message: 'A session with this join code already exists.'
  },

  // Foreign keys (deleting dependent resources)
  sessions_question_set_id_fkey: {
    status: 409,
    code: 'QUESTION_SET_IN_USE',
    message: 'This question set is being used in a game session and cannot be deleted.'
  },
  questions_question_set_id_fkey: {
    status: 409,
    code: 'QUESTION_SET_HAS_QUESTIONS',
    message: 'Cannot delete question set because it contains questions.'
  },

  // User account uniqueness
  users_school_id_key: {
    status: 409,
    code: 'SCHOOL_ID_TAKEN',
    message: 'This school ID is already registered.'
  },
  users_email_key: {
    status: 409,
    code: 'EMAIL_TAKEN',
    message: 'This email address is already in use.'
  },
  users_username_key: {
    status: 409,
    code: 'USERNAME_TAKEN',
    message: 'This username is already taken.'
  },
  hosts_username_key: {
    status: 409,
    code: 'HOST_USERNAME_TAKEN',
    message: 'This host username is already taken.'
  }
};