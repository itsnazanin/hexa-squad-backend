-- CreateIndex
CREATE INDEX "BlogReaction_blogId_idx" ON "BlogReaction"("blogId");

-- CreateIndex
CREATE INDEX "Comment_courseId_idx" ON "Comment"("courseId");

-- CreateIndex
CREATE INDEX "Comment_blogId_idx" ON "Comment"("blogId");

-- CreateIndex
CREATE INDEX "Comment_parentId_idx" ON "Comment"("parentId");

-- CreateIndex
CREATE INDEX "CommentLike_commentId_idx" ON "CommentLike"("commentId");

-- CreateIndex
CREATE INDEX "Course_teacherId_idx" ON "Course"("teacherId");

-- CreateIndex
CREATE INDEX "Course_categoryId_idx" ON "Course"("categoryId");

-- CreateIndex
CREATE INDEX "Favorite_userId_idx" ON "Favorite"("userId");

-- CreateIndex
CREATE INDEX "Favorite_courseId_idx" ON "Favorite"("courseId");

-- CreateIndex
CREATE INDEX "Favorite_blogId_idx" ON "Favorite"("blogId");

-- CreateIndex
CREATE INDEX "Lesson_sectionId_idx" ON "Lesson"("sectionId");

-- CreateIndex
CREATE INDEX "Order_userId_idx" ON "Order"("userId");

-- CreateIndex
CREATE INDEX "OrderItem_orderId_idx" ON "OrderItem"("orderId");

-- CreateIndex
CREATE INDEX "OrderItem_courseId_idx" ON "OrderItem"("courseId");

-- CreateIndex
CREATE INDEX "PurchasedCourse_userId_idx" ON "PurchasedCourse"("userId");

-- CreateIndex
CREATE INDEX "PurchasedCourse_courseId_idx" ON "PurchasedCourse"("courseId");

-- CreateIndex
CREATE INDEX "Review_courseId_idx" ON "Review"("courseId");

-- CreateIndex
CREATE INDEX "Section_courseId_idx" ON "Section"("courseId");
