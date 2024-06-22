import { createSlice } from "@reduxjs/toolkit";


const commentSlice = createSlice({
    name: 'comments',
    initialState: {
        commentsList: []
    },
    reducers: {
        addCommentsList: (state, action) => {
            state.commentsList = action.payload
        },

        addComment: (state, action) => {
            state.commentsList.push(action.payload);
        }
    }
});

export const { addCommentsList, addComment } = commentSlice.actions;

export default commentSlice.reducer;