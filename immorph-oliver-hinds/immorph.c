/*****************************************************************************
 * immorph.c is the source file for an image morphing application
 *
 * Oliver Hinds <oph@bu.edu> 2004-01-22
 * CS580 Assignment 1 -- image morphing
 *
 * This application is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by the
 * Free Software Foundation; either version 2 of the License, or (at your
 * option) any later version.
 *
 * CVCNS Central Field Retinotopy Stimulator is distributed in the hope that
 * it will be useful, but WITHOUT ANY WARRANTY; without even the implied
 * warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License along
 * with this application; if not, write to the Free Software Foundation,
 * Inc., 59 Temple Place, Suite 330, Boston, MA 02111-1307 USA
 *****************************************************************************/

#include"immorph.h"

/** creation functions **/

/**
 * initialization
 */
void init(void) {
    /* load the images */
    srcImg = jpegRead(srcImgName);
    jpegFlip(&srcImg);
    srcImg.x = borderWidth;
    srcImg.y = textHeight + borderWidth;
    printf("loaded %s, w=%d, h=%d ...\n", srcImgName, srcImg.width, srcImg.height);

    dstImg = jpegRead(dstImgName);
    jpegFlip(&dstImg);
    dstImg.x = srcImg.x + srcImg.width + borderWidth;
    dstImg.y = textHeight + borderWidth;
    printf("loaded %s, w=%d, h=%d ...\n", dstImgName, dstImg.width, dstImg.height);

    resImg = getGrayImg(dstImg.width, dstImg.height);
    resImg.x = dstImg.x + dstImg.width + borderWidth;
    resImg.y = textHeight + borderWidth;

    /* reshape the window to fit the images and text*/
    if (debug) printf("resizing window to %dx%d ...\n",
            3 * borderWidth + srcImg.width + dstImg.width,
            textHeight + 3 * borderWidth + maxi(srcImg.height, dstImg.height));
    WIN_WIDTH = 4 * borderWidth + srcImg.width + 2 * dstImg.width;
    WIN_HEIGHT = textHeight + 3 * borderWidth + maxi(srcImg.height, dstImg.height);

    /* load lines if needed */
    if (strcmp(linesReadFilename, "")) {
        readLines();
    }
}

/**
 * cleans up, closes files, etc...
 */
void destroy(void) {
    free(srcImg.buffer);
    free(dstImg.buffer);
    free(resImg.buffer);
    free(frames);
}

/** processing functions **/

/**
 * tests point for containment in an image with respect to window coordinates
 */
bool inImg(Image *img, int x, int y) {
    y = getWindowHeight() - y;
    return x >= rint(img->x)
            && x < rint(img->x + img->width)
            && y >= rint(img->y)
            && y < rint(img->y + img->height);
}

/**
 * tests point for containment in an image with respect to image coordinates
 */
bool inImgP(Image* img, point *p) {
    return rint(p->x) >= 0
            && rint(p->x) < img->width
            && rint(p->y) >= 0
            && rint(p->y) < img->height;
}

/**
 * warps a src image into a destination image based on a line correspondence
 * ALGORITHM SHOWN IN THE PAPER
 * For each pixel X in the destination
 *     DSUM = (0,0)
 *     weightsum = 0
 *     For each line Pi Qi
 *             calculate u,v based on Pi Qi
 *             calculate X'i based on u,v       and Pi'Qi'
 *             calculate displacement Di = Xi' - Xi for this line
 *             dist = shortest distance from X to Pi Qi
 *             weight = (lengthp / (a + dist))b
 *             DSUM += Di *    weight
 *             weightsum += weight
 *     X' = X + DSUM / weightsum
 *     destinationImage(X) = sourceImage(X')
 */
Image *warp(Image *srcImg, line *srcLines, line *dstLines,
        int numLines, Image *dstImg) {
    float weightsum = 0,
            weight, dist, u, v;
    int i,
            x = 0,
            y = 0,
            lineSize, totalSize;
    point xi, xp, di, dsum;

    /* condition the lines */
    if (!conditionLines(numSrcLines, srcLines)
            || !conditionLines(numDstLines, dstLines)) {
        return NULL;
    }

    /* get image geom */
    lineSize = dstImg->width * 3;
    totalSize = dstImg->height*lineSize;

    /* implement the algorithm shown at the top */
    for (y = 0; y < dstImg->height; y++) {
        for (x = 0; x < dstImg->width; x++) {
            dsum.x = 0;
            dsum.y = 0;
            weightsum = 0;
            xi.x = x;
            xi.y = y;
            if (debug) printf("finding dstImg pixel (%f,%f)...\n", (double) xi.x, (double) xi.y);

            for (i = 0; i < numLines; i++) {
                if (debug) printf("finding line %d: (%f,%f)->(%f,%f): (%f,%f)->(%f,%f)...\n", i, srcLines[i].p1.x, srcLines[i].p1.y, srcLines[i].p2.x, srcLines[i].p2.y, dstLines[i].p1.x, dstLines[i].p1.y, dstLines[i].p2.x, dstLines[i].p2.y);

                /* calculate u,v based on Pi Qi */
                u = getU(&dstLines[i], &xi);
                v = getV(&dstLines[i], &xi);

                /* calculate X'i based on u,v and Pi'Qi' */
                getXp(u, v, &srcLines[i], &xi, &xp);

                if (debug) printf("params: u=%f, v=%f, xp.x=%f, xp.y%f\n", (double) u, (double) v, (double) xp.x, (double) xp.y);

                /* calculate displacement Di = Xi' - Xi for this line */
                di.x = xp.x - xi.x;
                di.y = xp.y - xi.y;

                /* dist = shortest distance from X to Pi Qi */
                dist = point2LineD(&xi, &dstLines[i]);

                /* weight = (lengthp / (a + dist))b */
                weight = pow(
                        pow(
                            lineLength(&dstLines[i]),
                            p) / (a + dist),
                        b);

                /* DSUM += Di *    weight */
                dsum.x += di.x*weight;
                dsum.y += di.y*weight;

                /* weightsum += weight */
                weightsum += weight;

                if (debug) printf("w=%f, ws=%f, di.x=%f, di.y%f\n", (double) weight, (double) weightsum, (double) di.x, (double) di.y);
            }

            /* X' = X + DSUM / weightsum */
            xp.x = xi.x + dsum.x / weightsum;
            xp.y = xi.y + dsum.y / weightsum;

            /* destinationImage(X) = sourceImage(X') */
            if (debug) printf("(%f,%f)->(%f,%f)...\n", (double) xp.x, (double) xp.y, (double) xi.x, (double) xi.y);

            /* copy the pixel to the destination image */
            if (inImgP(srcImg, &xp)) {
                copyPixel(srcImg, &xp, &xi, dstImg);
            }
        }
    }
    return dstImg;
}

/**
 * copies a pixel from one image to another, handling sampling
 */
void copyPixel(Image *srcImg, point *srcPt, point *dstPt, Image *dstImg) {
    char pixVal[3];
    int x = (int) rint(dstPt->x),
            y = (int) rint(dstPt->y),
            lineSize = dstImg->width * 3;

    if (dstImg->buffer == NULL) return;

    /* get the pixel in the dest img */
    nnInterp(srcImg, srcPt, pixVal);

    /* copy it */
    dstImg->buffer[y * lineSize + 3 * x] = pixVal[0];
    dstImg->buffer[y * lineSize + 3 * x + 1] = pixVal[1];
    dstImg->buffer[y * lineSize + 3 * x + 2] = pixVal[2];
}

/**
 * performs bilinear interpolation
 */
char *bilinearInterp(Image* img, point *p, char* pixel) {
    int x = (int) floor(p->x),
            y = (int) floor(p->y),
            lineSize, totalSize;

    unsigned char
    ix_y[3] = {0, 0, 0},
    ix_1_y[3] = {0, 0, 0},
    ix_y_1[3] = {0, 0, 0},
    ix_1_y_1[3] = {0, 0, 0};

    float a = p->x - x,
            b = p->y - y;

    /* validate */
    if (img == NULL) {
        return NULL;
    }

    if (img->buffer == NULL) {
        return NULL;
    }

    /* get image geometry */
    lineSize = img->width * 3;
    totalSize = img->height*lineSize;

    /* find four surrounding pixels */
    ix_y[0] = img->buffer[lineSize * y + 3 * x];
    ix_y[1] = img->buffer[lineSize * y + 3 * x + 1];
    ix_y[2] = img->buffer[lineSize * y + 3 * x + 2];

    if (x < img->width) {
        ix_1_y[0] = img->buffer[lineSize * y + 3 * (x + 1)];
        ix_1_y[1] = img->buffer[lineSize * y + 3 * (x + 1) + 1];
        ix_1_y[2] = img->buffer[lineSize * y + 3 * (x + 1) + 2];
    }

    if (y < img->height) {
        ix_y_1[0] = img->buffer[lineSize * (y + 1) + 3 * x];
        ix_y_1[1] = img->buffer[lineSize * (y + 1) + 3 * x + 1];
        ix_y_1[2] = img->buffer[lineSize * (y + 1) + 3 * x + 2];
    }

    if (x < img->width && y < img->height) {
        ix_1_y_1[0] = img->buffer[lineSize * (y + 1) + 3 * (x + 1)];
        ix_1_y_1[1] = img->buffer[lineSize * (y + 1) + 3 * (x + 1) + 1];
        ix_1_y_1[2] = img->buffer[lineSize * (y + 1) + 3 * (x + 2) + 2];
    }

    /* combine colors individually */
    pixel[0] = (int) rint((1 - a)*(1 - b) * ix_y[0]
            + a * (1 - b) * ix_1_y[0]
            + a * b * ix_1_y_1[0]
            + (1 - a) * b * ix_y_1[0]);

    pixel[1] = (int) rint((1 - a)*(1 - b) * ix_y[1]
            + a * (1 - b) * ix_1_y[1]
            + a * b * ix_1_y_1[1]
            + (1 - a) * b * ix_y_1[1]);

    pixel[2] = (int) rint((1 - a)*(1 - b) * ix_y[2]
            + a * (1 - b) * ix_1_y[2]
            + a * b * ix_1_y_1[2]
            + (1 - a) * b * ix_y_1[2]);

    return pixel;
}

/**
 * performs nearest neighbor interpolation
 */
char *nnInterp(Image* img, point *p, char* pixel) {
    int x = (int) rint(p->x),
            y = (int) rint(p->y),
            lineSize;

    /* validate */
    if (img == NULL) {
        return NULL;
    }

    if (img->buffer == NULL) {
        return NULL;
    }

    /* get image geom */
    lineSize = img->width * 3;

    /* combine colors individually */
    pixel[0] = img->buffer[lineSize * y + 3 * x];
    pixel[1] = img->buffer[lineSize * y + 3 * x + 1];
    pixel[2] = img->buffer[lineSize * y + 3 * x + 2];
    return pixel;
}

/**
 * get the u value for a line and point
 */
float getU(line *pq, point *x) {
    return ((x->x - pq->p1.x)*(pq->p2.x - pq->p1.x) +
            (x->y - pq->p1.y)*(pq->p2.y - pq->p1.y))
            / slength(&pq->p1, &pq->p2);
}

/**
 * get the v value for a line and point
 */
float getV(line *pq, point *x) {
    point perp;
    perpendicular(pq, &perp);
    return ((x->x - pq->p1.x) * perp.x + (x->y - pq->p1.y) * perp.y) / lineLength(pq);
}

/**
 *gets the point in the source image for a point in the dest image
 */
point *getXp(float u, float v, line *pqp, point *x, point *xp) {
    float len = lineLength(pqp);
    point perp;
    perpendicular(pqp, &perp);

    xp->x = pqp->p1.x + u * (pqp->p2.x - pqp->p1.x) + (v * (perp.x)) / len;
    xp->y = pqp->p1.y + u * (pqp->p2.y - pqp->p1.y) + (v * (perp.y)) / len;
    return xp;
}

/**
 * gets the distance from a point to a line
 */
float point2LineD(point* x, line* pq) {
    float c, d, e;
    point u, v, w;

    /* get the vector representation of the line */
    v.x = pq->p2.x - pq->p1.x;
    v.y = pq->p2.y - pq->p1.y;

    /* get the point in relation to the vector */
    w.x = x->x - pq->p1.x;
    w.y = x->y - pq->p1.y;

    c = w.x * v.x + w.y * v.y;
    if (c <= 0) {
        return sqrt(pow(x->x - pq->p1.x, 2) + pow(x->y - pq->p1.y, 2));
    }

    d = pow(v.x, 2) + pow(v.y, 2);
    if (d <= c) {
        return sqrt(pow(x->x - pq->p2.x, 2) + pow(x->y - pq->p2.y, 2));
    }

    e = c / d;
    u.x = pq->p1.x + e * v.x;
    u.y = pq->p1.y + e * v.y;
    return sqrt(pow(x->x - u.x, 2) + pow(x->y - u.y, 2));
}

/**
 * gets the vector perpendicular to the line passed with the same length
 */
point *perpendicular(line *pq, point *perp) {
    float m = -(pq->p2.x - pq->p1.x) / (float) (pq->p2.y - pq->p1.y),
            len = lineLength(pq);
    perp->y = m * len / sqrt(1 + pow(m, 2));
    perp->x = sqrt(pow(len, 2) - pow(perp->y, 2));
    return perp;
}

/**
 * gets the line length
 */
float lineLength(line *n) {
    return length(&n->p1, &n->p2);
}

/**
 * gets the length between two points
 */
float length(point *p, point *q) {
    return sqrt(slength(p, q));
}

/**
 * gets the squared length between two points
 */
float slength(point *p, point *q) {
    return pow(q->x - p->x, 2) + pow(q->y - p->y, 2);
}

/**
 * get location of linearly interpolated lines at a certain ratio
 */
void getLines(line *srcLines, line *dstLines, int numLines,
        int fr, int numFrames, line *frDstLines) {
    float dstR = (fr + 1) / (float) numFrames;
    int i;
    for (i = 0; i < numLines; i++) {
        frDstLines[i].p1.x = srcLines[i].p1.x + dstR * (dstLines[i].p1.x - srcLines[i].p1.x);
        frDstLines[i].p1.y = srcLines[i].p1.y + dstR * (dstLines[i].p1.y - srcLines[i].p1.y);
        frDstLines[i].p2.x = srcLines[i].p2.x + dstR * (dstLines[i].p2.x - srcLines[i].p2.x);
        frDstLines[i].p2.y = srcLines[i].p2.y + dstR * (dstLines[i].p2.y - srcLines[i].p2.y);
    }
}

/**
 * conditions lines so there are no infinite or zero slopes
 */
bool conditionLines(int numLines, line* lines) {
    int i;
    for (i = 0; i < numLines; i++) {
        if (0.001f > fabs(lines[i].p1.x - lines[i].p2.x)) {
            printf("error: line %d vertical (%f,%f)->(%f,%f), please correct.\n", i, lines[i].p1.x, lines[i].p1.y, lines[i].p2.x, lines[i].p2.y);
            return false;
        }
        if (0.001f > fabs(lines[i].p1.y - lines[i].p2.y)) {
            printf("error: line %d horizontal (%f,%f)->(%f,%f), please correct.\n", i, lines[i].p1.x, lines[i].p1.y, lines[i].p2.x, lines[i].p2.y);
            return false;
        }
    }
    return true;
}

/**
 * cross dissolves two images
 */
void crossDissolve(Image *frSrc, Image *frDst, float ratio, Image *fr) {
    int i;
    for (i = 0; i < frSrc->height * 3 * frSrc->width; i++) {
        fr->buffer[i] = ratio * frSrc->buffer[i] + (1 - ratio) * frDst->buffer[i];
    }
}

/**
 * saves the frames to files
 */
void saveFrames(Image *frames) {
    int i, curFile = 0, numFiles = 2 * (endHoldLen + numFrames);
    FILE *fp;
    char name[MAX_STR_LEN];

    printf("saving %d frames...\n", numFiles + 1);

    /* write the first frame endHoldLen times */
    jpegFlip(&frames[0]);
    for (i = 0; i < endHoldLen; i++) {
        strcpy(name, frameBaseName);
        if (curFile < 100) {
            if (curFile < 10) {
                strcat(name, "0");
            }
            strcat(name, "0");
        }
        fp = fopen(strcat(strcat(name, itoa(curFile++)), ".jpg"), "w+");
        printf("writing frame %d to %s...", 0, name);
        jpegWrite(&frames[0], fp);
        printf("done\n");
        fclose(fp);
    }

    /* write the last frame as the first */
    strcpy(name, frameBaseName);
    if (numFiles < 100) {
        if (numFiles < 10) {
            strcat(name, "0");
        }
        strcat(name, "0");
    }
    fp = fopen(strcat(strcat(name, itoa(numFiles)), ".jpg"), "w+");
    printf("writing frame %d to %s...", 0, name);
    jpegWrite(&frames[0], fp);
    printf("done\n");
    fclose(fp);

    jpegFlip(&frames[0]);

    /* write 2 jpegs for each frame */
    for (i = 1; i <= numFrames; i++) {
        jpegFlip(&frames[i]);

        /* forward frame */
        strcpy(name, frameBaseName);
        if (curFile < 100) {
            if (curFile < 10) {
                strcat(name, "0");
            }
            strcat(name, "0");
        }
        fp = fopen(strcat(strcat(name, itoa(curFile++)), ".jpg"), "w+");
        printf("writing frame %d to %s...", i, name);
        jpegWrite(&frames[i], fp);
        printf("done\n");
        fclose(fp);

        /* backward frame */
        strcpy(name, frameBaseName);
        if (2 * (endHoldLen + numFrames) - i < 100) {
            if (2 * (endHoldLen + numFrames) - i < 10) {
                strcat(name, "0");
            }
            strcat(name, "0");
        }
        fp = fopen(strcat(strcat(name, itoa(2 * (endHoldLen + numFrames) - i)), ".jpg"), "w+");
        printf("writing frame %d to %s...", i, name);
        jpegWrite(&frames[i], fp);
        printf("done\n");
        fclose(fp);

        jpegFlip(&frames[i]);
    }
    curFile = endHoldLen + numFrames;

    /* write the last frame endHoldLen times */
    jpegFlip(&frames[numFrames + 1]);
    for (i = 0; i < endHoldLen; i++) {
        strcpy(name, frameBaseName);
        if (curFile < 100) {
            if (curFile < 10) {
                strcat(name, "0");
            }
            strcat(name, "0");
        }
        fp = fopen(strcat(strcat(name, itoa(curFile++)), ".jpg"), "w+");
        printf("writing frame %d to %s...", numFrames + 1, name);
        jpegWrite(&frames[numFrames + 1], fp);
        printf("done\n");
        fclose(fp);
    }
    jpegFlip(&frames[numFrames + 1]);

    printf("done\n");
}

/**
 * saves the lines to a file
 */
void saveLines() {
    int i;
    FILE *fp;

    fp = fopen(linesSaveFilename, "w+");
    fprintf(fp, "%d\n", numSrcLines);

    /* write each srcImg line */
    for (i = 0; i < numSrcLines; i++) {
        fprintf(fp, "%f %f %f %f\n", srcLines[i].p1.x, srcLines[i].p1.y,
                srcLines[i].p2.x, srcLines[i].p2.y);
    }

    /* dst lines */
    fprintf(fp, "%d\n", numDstLines);
    for (i = 0; i < numDstLines; i++) {
        fprintf(fp, "%f %f %f %f\n", dstLines[i].p1.x, dstLines[i].p1.y,
                dstLines[i].p2.x, dstLines[i].p2.y);
    }
    fclose(fp);
}

/**
 * reads lines from a file
 */
void readLines() {
    int i;
    FILE *fp;

    fp = fopen(linesReadFilename, "r");
    fscanf(fp, "%d", &numSrcLines);
    for (i = 0; i < numSrcLines; i++) {
        fscanf(fp, "%f %f %f %f", &srcLines[i].p1.x, &srcLines[i].p1.y,
                &srcLines[i].p2.x, &srcLines[i].p2.y);
    }

    fscanf(fp, "%d", &numDstLines);
    for (i = 0; i < numDstLines; i++) {
        fscanf(fp, "%f %f %f %f", &dstLines[i].p1.x, &dstLines[i].p1.y,
                &dstLines[i].p2.x, &dstLines[i].p2.y);
    }
}

/** state update functions **/

/**
 * checks if the display should update
 */
void idle(void) {
    static int nextDraw = 0;

    if (glutGet(GLUT_ELAPSED_TIME) >= nextDraw) {
        redisplay();
        nextDraw = glutGet(GLUT_ELAPSED_TIME) + framePeriod;
    }
}


/** display related functions **/

/**
 * handles the user resizing the window
 */
void reshape(int w, int h) {
    glutReshapeWindow(WIN_WIDTH, WIN_HEIGHT);
}

/**
 * handles the update of the display screen
 */
void draw(void) {
    int winWidth = getWindowWidth();
    int winHeight = getWindowHeight();
    static bool firstDraw = 1;
    static int curFrame = 0;
    static int dir = -1;
    int i;
    static int endHold = 4;

    if (debug) printf("drawing with window size %dx%d ...\n",
            winWidth, winHeight);

    glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);

    /* draw instructions at the bottom of the window */
    drawString(10, 10, instructions, COLORS[RED]);

    glMatrixMode(GL_PROJECTION);
    glPushMatrix();
    glLoadIdentity();
    glOrtho(0.0, winWidth,
            0.0, winHeight, -1.0, 1.0);
    glMatrixMode(GL_MODELVIEW);
    glPushMatrix();
    glLoadIdentity();

    /* draw the images */
    glRasterPos2i(srcImg.x, srcImg.y);
    glDrawPixels(srcImg.width, srcImg.height, GL_RGB, GL_UNSIGNED_BYTE, srcImg.buffer);
    glRasterPos2i(dstImg.x, dstImg.y);
    glDrawPixels(dstImg.width, dstImg.height, GL_RGB, GL_UNSIGNED_BYTE, dstImg.buffer);

    /* decide if we should display a gray image, or a frame */
    if (framesCaptured > curFrame) {
        glRasterPos2i(frames[curFrame].x, frames[curFrame].y);
        glDrawPixels(frames[curFrame].width, frames[curFrame].height, GL_RGB, GL_UNSIGNED_BYTE, frames[curFrame].buffer);

        /* update the frames for animation */
        if (curFrame == 0 || curFrame == numFrames + 1) {
            if (!endHold) {
                dir *= -1;
                curFrame = (curFrame + dir) % (numFrames + 2);
                endHold = endHoldLen;
            } else {
                endHold--;
            }
        } else {
            curFrame = (curFrame + dir) % (numFrames + 2);
        }
    } else {
        /* just draw the gray rect */
        glRasterPos2i(resImg.x, resImg.y);
        glDrawPixels(resImg.width, resImg.height, GL_RGB, GL_UNSIGNED_BYTE, resImg.buffer);
    }

    /* draw the lines */
    glLineWidth(2.0);
    glBegin(GL_LINES);
    {
        for (i = 0; i < numSrcLines; i++) {
            glColor3fv(COLORS[GREEN]);
            glVertex2i(srcLines[i].p1.x + srcImg.x, srcLines[i].p1.y + srcImg.y);
            glVertex2i(srcLines[i].p2.x + srcImg.x, srcLines[i].p2.y + srcImg.y);
        }

        for (i = 0; i < numDstLines; i++) {
            glColor3fv(COLORS[RED]);
            glVertex2i(dstLines[i].p1.x + dstImg.x, dstLines[i].p1.y + dstImg.y);
            glVertex2i(dstLines[i].p2.x + dstImg.x, dstLines[i].p2.y + dstImg.y);
        }
    }
    glEnd();

    glPopMatrix();
    glMatrixMode(GL_PROJECTION);
    glPopMatrix();
    glMatrixMode(GL_MODELVIEW);

    swapBuffers();

    if (firstDraw) {
        firstDraw = false;
        redisplay();
    }

}

/**
 * post a buffer swap event
 */
void swapBuffers() {
    glutSwapBuffers();
}

/**
 * post a redisplay event
 */
void redisplay() {
    glutPostRedisplay();
}

/** event handlers **/

/**
 * keyboard handler
 */
void keyboard(unsigned char key, int x, int y) {
    switch (key) {
        case 27: /* ESC */
            destroy();
            exit(0);
            break;
        case 10: /* LF */
        case 13: /* CR */
            runMorph();
            break;
        case 's':
        case 'S':
            if (framesCaptured) {
                if (!strcmp(frameBaseName, "")) {
                    strcpy(frameBaseName, "frame_");
                }
                saveFrames(frames);
            }
            break;
        default:
            break;
    }
}

/**
 * mouse handler
 */
void mouse(int button, int state, int x, int y) {
    int winH = getWindowHeight();

    if (debug) printf("mouse event at (%d,%d)\n", x, y);

    /* test the buttons */
    if (button == GLUT_LEFT_BUTTON && state == GLUT_DOWN) {
        if (numSrcLines == numDstLines && inImg(&srcImg, x, y)) {
            srcLines[numSrcLines].p1.x = x - srcImg.x;
            srcLines[numSrcLines].p1.y = (winH - y) - srcImg.y;
            drawingSrcLine = true;
        } else if (numDstLines < numSrcLines && inImg(&dstImg, x, y)) {
            dstLines[numDstLines].p1.x = x - dstImg.x;
            dstLines[numDstLines].p1.y = (winH - y) - dstImg.y;
            drawingDstLine = true;
        }
    } else if (button == GLUT_LEFT_BUTTON && state == GLUT_UP) {
        if (drawingSrcLine) {
            if (inImg(&srcImg, x, y)) {
                srcLines[numSrcLines].p2.x = x - srcImg.x;
                srcLines[numSrcLines].p2.y = (winH - y) - srcImg.y;
            } else {
                fprintf(stderr, "invalid line end. please click another location.\n");
            }
            numSrcLines++;
            drawingSrcLine = false;
            redisplay();
        } else if (numDstLines < numSrcLines && inImg(&dstImg, x, y)) {
            if (drawingDstLine) {
                dstLines[numDstLines].p2.x = x - dstImg.x;
                dstLines[numDstLines].p2.y = (winH - y) - dstImg.y;
            } else {
                fprintf(stderr, "invalid line end. please click another location.\n");
            }
            numDstLines++;
            drawingDstLine = false;
            redisplay();
        }
    }
}

/**
 * error handler
 */
void CALLBACK error(GLenum errCode) {
    const GLubyte *errStr = gluErrorString(errCode);
    fprintf(stderr, "fatal error: %s\n", errStr);
    exit(0);
}

/** util functions **/

/**
 * gets a gray image
 */
Image getGrayImg(int width, int height) {
    Image image;

    int x, y;

    /* Initialise image */
    image.width = width;
    image.height = height;
    image.buffer = NULL;


    /* Allocate space for RGB texture */
    image.buffer = calloc(image.width * image.height * 3, sizeof (unsigned char));
    for (y = 0; y < image.height; y++) {
        for (x = 0; x < image.width; x++) {
            image.buffer[3 * y * image.width + 3 * x] = 128;
            image.buffer[3 * y * image.width + 3 * x + 1] = 128;
            image.buffer[3 * y * image.width + 3 * x + 2] = 128;
        }
    }

    return image;
}

/** math stuff **/

/**
 * finds the max of two numbers 
 */
int maxi(int a, int b) {
    return b > a ? b : a;
}

long maxl(long a, long b) {
    return b > a ? b : a;
}

float maxf(float a, float b) {
    return b > a ? b : a;
}

double maxd(double a, double b) {
    return b > a ? b : a;
}

/**
 * finds the min of two numbers 
 */
int mini(int a, int b) {
    return b < a ? b : a;
}

long minl(long a, long b) {
    return b < a ? b : a;
}

float minf(float a, float b) {
    return b < a ? b : a;
}

double mind(double a, double b) {
    return b < a ? b : a;
}

/**
 * converts an integer to a string
 * original by Manuel Novoa III.
 */
char *itoa(int i) {
    /* 10 digits + 1 sign + 1 trailing nul */
    static char buf[12];

    char *pos = buf + sizeof (buf) - 1;
    unsigned int u;
    int negative = 0;

    if (i < 0) {
        negative = 1;
        u = ((unsigned int) (-(1 + i))) + 1;
    } else {
        u = i;
    }

    *pos = 0;

    do {
        *--pos = '0' + (u % 10);
        u /= 10;
    } while (u);

    if (negative) {
        *--pos = '-';
    }

    return pos;
}

/* jon's jpeg reading code */

/**
 * flip a jpeg image
 */
void jpegFlip(Image *img)
/* 
 * reverse ordering of rows in buffer, since jpeg storage is flipped
 * with respect to openGL's buffer format.
 *
 * jpegFlip() expects a buffer with 3 color channels (e.g., RGB)
 */ {

    int row_ind, col_ind, nRows, nCols, w = img->width, h = img->height;
    unsigned char *imgbuf = img->buffer, *flip = NULL;

    /* each row contains 'w' pixels with 3 color components each (r,g,b) */
    nCols = w * 3;
    nRows = h;

    if ((flip = (unsigned char *) malloc((size_t) w * h * 3 * sizeof (unsigned char))) == NULL)
        fprintf(stderr, "[jpegFlip]: error allocating buffer space\n");

    for (row_ind = 0; row_ind < nRows; row_ind++) {
        for (col_ind = 0; col_ind < nCols; col_ind++) {
            /* copy each row to the its vertical complement */
            flip[ row_ind * nCols + col_ind ] = imgbuf[ (nRows - row_ind - 1) * nCols + col_ind ];
        }
    }
    free(imgbuf);
    img->buffer = flip;
} /* jpegFlip() */

/**
 * reads in and decompresses JPEG file 
 */
Image jpegRead(char *filename) {
    struct jpeg_decompress_struct dinfo;
    struct jpeg_error_mgr jerr;

    static int w, h, c;
    Image img;
    unsigned char *row;

    JSAMPARRAY buffer;

    int row_stride, i = 0;

    FILE* infile = fopen(filename, "rb");
    if (!infile) {
        fprintf(stderr, "can't open %s\n", filename);
        exit(1);
    } else {

        dinfo.err = jpeg_std_error(&jerr);
        jpeg_create_decompress(&dinfo);

        jpeg_stdio_src(&dinfo, infile);
        jpeg_read_header(&dinfo, TRUE);
        jpeg_start_decompress(&dinfo);

        w = dinfo.output_width;
        h = dinfo.output_height;
        c = dinfo.output_components;

        /*	fprintf(msgbuf, "w=%d,h=%d,c=%d\n", w, h, c);*/

        row_stride = dinfo.output_width * dinfo.output_components;

        if ((img.buffer = (unsigned char *) calloc((size_t) w * h * c, sizeof (unsigned char))) == NULL)
            fprintf(stderr, "error!");
        /* rgb comps (jpeg) */

        buffer = (*dinfo.mem->alloc_sarray)
                ((j_common_ptr) & dinfo, JPOOL_IMAGE, row_stride, 1);

        row = img.buffer;
        while (dinfo.output_scanline < dinfo.output_height) {
            jpeg_read_scanlines(&dinfo, buffer, 1);
            for (i = 0; i < row_stride; i++)
                row[i] = buffer[0][i];
            row += row_stride;
        }
        jpeg_finish_decompress(&dinfo);
        jpeg_destroy_decompress(&dinfo);
        fclose(infile);
    }
    img.width = w;
    img.height = h;

    return img;
} /* jpegRead() */

/**
 * write data in buffer to file at end of file pointer 
 */
void jpegWrite(Image *img, FILE *jfile) {
    struct jpeg_compress_struct cinfo;
    struct jpeg_error_mgr jerr;
    int row_stride, w = img->width, h = img->height;
    JSAMPROW row_pointer[1];

    cinfo.err = jpeg_std_error(&jerr);
    jpeg_create_compress(&cinfo);

    jpeg_stdio_dest(&cinfo, jfile);
    cinfo.image_width = w;
    cinfo.image_height = h;
    cinfo.input_components = 3;
    cinfo.in_color_space = JCS_RGB; /* arbitrary guess */
    jpeg_set_defaults(&cinfo);

    jpeg_set_quality(&cinfo, 100, TRUE);

    jpeg_start_compress(&cinfo, TRUE);

    row_stride = cinfo.image_width * cinfo.input_components;

    while (cinfo.next_scanline < cinfo.image_height) {
        row_pointer[0] = &img->buffer[cinfo.next_scanline * row_stride];
        jpeg_write_scanlines(&cinfo, row_pointer, 1);
    }
    jpeg_finish_compress(&cinfo);
    jpeg_destroy_compress(&cinfo);

    return;
} /* jpegWrite() */

/**
 * gets the screen width
 */
int getScreenWidth() {
    return glutGet(GLUT_SCREEN_WIDTH);
}

/**
 * gets the screen height
 */
int getScreenHeight() {
    return glutGet(GLUT_SCREEN_HEIGHT);
}

/**
 * gets the window width
 */
int getWindowWidth() {
    return glutGet(GLUT_WINDOW_WIDTH);
}

/**
 * gets the window height
 */
int getWindowHeight() {
    return glutGet(GLUT_WINDOW_HEIGHT);
}

/**
 * draws a string at the specified coordinates
 * implementation taken from
 * http://www.york.ac.uk/services/cserv/sw/graphics/OPENGL/L23a.html
 */
void drawString(GLint x, GLint y, char* s, const GLfloat *color) {
    int lines;
    char* p;

    glMatrixMode(GL_PROJECTION);
    glPushMatrix();
    glLoadIdentity();
    glOrtho(0.0, getScreenWidth(),
            0.0, getScreenHeight(), -1.0, 1.0);
    glMatrixMode(GL_MODELVIEW);
    glPushMatrix();
    glLoadIdentity();
    glColor3fv(color);
    glRasterPos2i(x, y);
    for (p = s, lines = 0; *p; p++) {
        if (*p == '\n') {
            lines++;
            glRasterPos2i(x, y - (lines * 18));
        }
        glutBitmapCharacter(GLUT_BITMAP_HELVETICA_18, *p);
    }
    glPopMatrix();
    glMatrixMode(GL_PROJECTION);
    glPopMatrix();
    glMatrixMode(GL_MODELVIEW);
}

/**
 * parse the command line args
 */
void parseArgs(int argc, char** argv) {
    int i;
    for (i = 1; i < argc; i++) {
        if (!strcmp(argv[i], "-a")) {
            a = atof(argv[++i]);
            continue;
        } else if (!strcmp(argv[i], "-b")) {
            b = atof(argv[++i]);
            continue;
        } else if (!strcmp(argv[i], "-p")) {
            p = atof(argv[++i]);
            continue;
        } else if (!strcmp(argv[i], "-f")) {
            strcpy(argv[++i], frameBaseName);
            save = true;
            continue;
        } else if (!strcmp(argv[i], "-n")) {
            numFrames = atoi(argv[++i]);
            continue;
        } else if (!strcmp(argv[i], "-l")) {
            strcpy(linesReadFilename, argv[++i]);
            continue;
        } else if (!strcmp(argv[i], "-o")) {
            strcpy(linesSaveFilename, argv[++i]);
            continue;
        }

        /* read img names */
        if (i == argc - 2) {
            strcpy(srcImgName, argv[i]);
        } else if (i == argc - 1) {
            strcpy(dstImgName, argv[i]);
        } else {
            printf("argument %s unrecognized and skipped.\n", argv[i]);
        }
    }
}

/**
 * validate the input arguments
 */
bool validateArgs() {
    bool retval = true;

    if (!strcmp("", srcImgName)) {
        printf("error: no source image specified\n");
        retval = false;
    }
    if (!strcmp("", dstImgName)) {
        printf("error: no destination image specified\n");
        retval = false;
    }

    return retval;
}

/** program flow control **/

/**
 * runs the morphing operation
 */
void runMorph() {
    int f;
    line *frSrcLines = NULL,
            *frDstLines = NULL;
    Image *frSrcImg = &srcImg,
            *frDstImg = &dstImg;

    /* save the lines drawn */
    if (strcmp(linesSaveFilename, "")) {
        saveLines();
    }

    /* validate image sizes and number of lines */
    if (srcImg.width != dstImg.width
            || srcImg.height != dstImg.height) {
        printf("dimensions of source and destination images must be equal\nexit\n");
        exit(1);
    }
    if (numSrcLines != numDstLines) {
        printf("there are %d source lines and %d destination lines. please correct\n", numSrcLines, numDstLines);
        return;
    }

    /* start the morphing */
    printf("running the morphing for %d frames with %d lines, a=%f, b=%f, p=%f...\n", numFrames + 2, numSrcLines, a, b, p);

    /**
     * allocate space for lines
     */
    if (!(frSrcLines = (line*) malloc(numSrcLines * sizeof (line))) ||
            !(frDstLines = (line*) malloc(numDstLines * sizeof (line)))) {
        printf("couldn't allocate space for lines.\nexit\n");
        exit(1);
    }

    /**
     * allocate frames and associated buffers, and the tmp images
     */
    if (!(frames = (Image*) malloc((numFrames + 2) * sizeof (Image)))) {
        printf("couldn't allocate space for the frames.\nexit\n");
        exit(1);
    }
    for (f = 0; f < numFrames + 2; f++) {
        if (!(frames[f].buffer = (unsigned char*)
                malloc(srcImg.height * 3 * srcImg.width * sizeof (unsigned char)))) {
            printf("couldn't allocate space for the frames.\nexit\n");
            exit(1);
        }
    }
    if (!(frSrcImg = (Image*) malloc(sizeof (Image)))
            || !(frSrcImg->buffer = (unsigned char*)
            malloc(srcImg.height * 3 * srcImg.width * sizeof (unsigned char)))) {
        printf("couldn't allocate space for the tmp images.\nexit\n");
        exit(1);
    }
    if (!(frDstImg = (Image*) malloc(sizeof (Image)))
            || !(frDstImg->buffer = (unsigned char*)
            malloc(srcImg.height * 3 * srcImg.width * sizeof (unsigned char)))) {
        printf("couldn't allocate space for the tmp images.\nexit\n");
        exit(1);
    }

    /**
     * copy the src and dst to the first and last frames
     */
    memcpy(frames[0].buffer, srcImg.buffer, srcImg.height * 3 * srcImg.width);
    memcpy(frames[numFrames + 1].buffer, dstImg.buffer, dstImg.height * 3 * dstImg.width);
    frames[0].x = resImg.x;
    frames[0].y = resImg.y;
    frames[0].width = srcImg.width;
    frames[0].height = srcImg.height;
    framesCaptured = 1;

    frSrcImg->x = resImg.x;
    frSrcImg->y = resImg.y;
    frSrcImg->width = srcImg.width;
    frSrcImg->height = srcImg.height;

    frDstImg->x = resImg.x;
    frDstImg->y = resImg.y;
    frDstImg->width = srcImg.width;
    frDstImg->height = srcImg.height;

    /* generate frames */
    for (f = 1; f <= numFrames; f++) {
        printf("morphing frame %d of %d... ", f, numFrames);

        /* get frame parameters */
        frames[f].x = resImg.x;
        frames[f].y = resImg.y;
        frames[f].width = srcImg.width;
        frames[f].height = srcImg.height;

        /* calculate the locations of the new lines and get the frame */
        getLines(srcLines, dstLines, numDstLines, f, numFrames, frDstLines);
        if (!warp(&srcImg, srcLines, frDstLines, numDstLines, frDstImg)) {
            return;
        }

        getLines(srcLines, dstLines, numDstLines, f, numFrames, frSrcLines);
        if (!warp(&dstImg, dstLines, frSrcLines, numSrcLines, frSrcImg)) {
            return;
        }

        /* cross dissolve the images into a frame */
        crossDissolve(frSrcImg, frDstImg, f / (float) numFrames, &frames[f]);

        framesCaptured++;
        printf("done\n");
    }

    /* make the last frame */
    frames[numFrames + 1].x = resImg.x;
    frames[numFrames + 1].y = resImg.y;
    frames[numFrames + 1].width = srcImg.width;
    frames[numFrames + 1].height = srcImg.height;
    framesCaptured++;

    printf("done morphing...\n");
    free(frSrcImg);
    free(frDstImg);
    free(frSrcLines);
    free(frDstLines);

    /* save the animation frames, if needed */
    if (save) {
        saveFrames(frames);
    }
}

/**
 * main function to control the stimulator
 */
int main(int argc, char** argv) {
    /* force syncing with vertical retrace (NVIDIA cards only!) */
    putenv("__GL_SYNC_TO_VBLANK=1");

    /* force syncing with vertical retrace (DRI drivers, e.g., ATi, only!) */
    putenv("LIBGL_SYNC_REFRESH=1");

    /* parse any cmd line args */
    parseArgs(argc, argv);
    if (!validateArgs()) {
        printf("fatal error(s), exiting.\n");
        exit(0);
    }

    /* initialize glut */
    init();
    glutInit(&argc, argv);
    glutInitDisplayMode(GLUT_DOUBLE | GLUT_RGB);
    glutInitWindowSize(WIN_WIDTH, WIN_HEIGHT);
    glutInitWindowPosition(100, 100);
    glutCreateWindow("image morphing app");
    glutSetCursor(GLUT_CURSOR_FULL_CROSSHAIR);

    /* initialize the app and register our functions */
    glutDisplayFunc(draw);
    glutReshapeFunc(reshape);
    glutIdleFunc(idle);
    glutKeyboardFunc(keyboard);
    glutMouseFunc(mouse);

    /* start running */
    glutMainLoop();

    return 0;
}
