
















# 1.2 Lowe's Ratio Test

# Find matches for lena image
matched_lena = cv2.BFMatcher()
num_matches_lena = matched_lena.knnMatch(lena_Descriptors,lena_Descriptors, k=2)
Arr_matches = [] # Array for matches deemed "Arr_matches"
for m,n in num_matches_lena:
    if m.distance < 0.75*n.distance: # Criteria for being a Arr_matches match. Where m is a better match than n. Threshold value = 0.75
        Arr_matches.append([m])
num_matches_lena_drawn = cv2.drawMatchesKnn(lena_gray,lena_keypoints,lena_gray,lena_keypoints,Arr_matches,None,flags=2)
plt.imshow(num_matches_lena_drawn),plt.show()

# Find matches for backpack image
matched_backpack = cv2.BFMatcher()
num_matches_backpack = matched_backpack.knnMatch(left_Descriptors, right_Descriptors, k=2)
Arr_matches = []
for m,n in num_matches_backpack:
    if m.distance < 0.75*n.distance:
        Arr_matches.append([m])
num_matches_backpack_drawn = cv2.drawMatchesKnn(left_backpack_img_GRAY,left_KeyPoints,right_backpack_img_GRAY,Right_KeyPoints,Arr_matches,None,flags=2)
plt.imshow(num_matches_backpack_drawn),plt.show()

distances = []
for m,n in num_matches_backpack:
    distances.append(abs(int(m.distance)))#-n.distance)))
max_val = np.max(distances)

distances2 = []
for m,n in num_matches_backpack:
    if m.distance < 0.75*n.distance:
        distances2.append(abs(int(m.distance)))
max_val2 = np.max(distances2)
plt.hist(distances, max_val, label='All Matches')
plt.hist(distances2, max_val, label='Lowe\'s Matches')
plt.legend(loc='upper right')
plt.title("Backpack Histogram")
plt.show()

dist_all_lena = []
for m,n in num_matches_lena:
    dist_all_lena.append(abs(int(m.distance)))
    dist_all_lena.append(abs(int(n.distance)))
max_all_lena = np.max(dist_all_lena)

dist_lowe_lena = []
for m,n in num_matches_lena:
    if m.distance < 0.75*n.distance:
        dist_lowe_lena.append(abs(int(m.distance)))
max_lowe_lena = np.max(dist_lowe_lena)
plt.hist(dist_all_lena, 10,(0,10), label='All Matches')
plt.hist(dist_lowe_lena, 10,(0,10), label='Lowe\'s Matches')
plt.legend(loc='upper right')
plt.title("lena's Histogram")
plt.show()