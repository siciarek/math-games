/*****************************************************************************
 * immorph.h is the main header file for the immorph application
 * Oliver Hinds <oph@bu.edu> 2004-01-22
 * CS580 Assignment 1
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

#ifndef IMMORPH_H
#define IMMORPH_H

#include<stdio.h>
#include<stdlib.h>
#include<math.h>
#include<string.h>

#include <jpeglib.h>
#include <jerror.h>

#ifndef MAC
#include<GL/glut.h>
#else
#include<GLUT/glut.h>
#endif

#ifndef CALLBACK
#define CALLBACK
#endif

#define debug 0

/******************************************************
 * constants
 ******************************************************/

typedef int bool;
const   bool false = 0;
const   bool true = 1;

/* max lengths */
#define MAX_FN_LEN 100
#define MAX_STR_LEN 100
#define MAX_LINES 100

/* screen attributes */
int WIN_WIDTH = 600;
int WIN_HEIGHT = 600;

typedef struct {
    int x, y, width, height;        // Width and height of the texture
    unsigned char *buffer;    // Pointer to memory that holds the texture information.
} Image;

/* colors */
enum COLOR_NAME {RED, BLUE, GREEN, WHITE, BLACK};

/* color vectors for ease of use*/
const GLfloat RED_V[] = {1.0, 0.0, 0.0};
const GLfloat BLUE_V[] = {0.0, 0.0, 1.0};
const GLfloat GREEN_V[] = {0.0, 1.0, 0.0};
const GLfloat WHITE_V[] = {1.0, 1.0, 1.0};
const GLfloat BLACK_V[] = {0.0, 0.0, 0.0};

/* array of the color vectors, to be indexed by the color names */
const GLfloat *COLORS[] = {RED_V, BLUE_V, GREEN_V, WHITE_V, BLACK_V};

/* gui constants */
const int borderWidth = 10; /* pixels */
const int textHeight = 15;  /* pixels */

/******************************************************
 * globals
 ******************************************************/

/* number of frames to generate */
int numFrames = 9;
int framePeriod = 100; /* ms */

/* warping parameters */
float a = 1,
  b = 1,
  p = 0.5;

/* images and their names*/
Image srcImg;
char srcImgName[MAX_STR_LEN] = "";
Image dstImg;
char dstImgName[MAX_STR_LEN] = "";
Image resImg;

/* array of frames */
Image *frames;
const int endHoldLen = 4;

/* if we should save the animation */
bool save = 0;
char frameBaseName[MAX_STR_LEN] = "";
int framesCaptured = 0;

/* if we should save lines */
char linesReadFilename[MAX_STR_LEN] = "";
char linesSaveFilename[MAX_STR_LEN] = "";

/* lines for the src and dst images */
typedef struct {
  float x,y;
} point;

typedef struct {
  point p1,p2;
} line;

line srcLines[MAX_LINES];
int numSrcLines = 0;
line dstLines[MAX_LINES];
int numDstLines = 0;

/* flags for line drawing */
bool drawingSrcLine = 0;
bool drawingDstLine = 0;

/* instructions for user */
char instructions[MAX_STR_LEN] = "draw corresponding lines, then press return to morph";

/******************************************************
 * functions
 ******************************************************/

/** creation functions **/

/**
 * initializes the stimulator
 */
void init(void);

/**
 * cleans up, closes files, etc...
 */
void destroy(void);

/** processing functions **/

/**
 * tests point for containment in an image
 */
bool inImg(Image *img, int x, int y);

/**
 * tests point for containment in an image
 */
bool inImgP(Image *img, point *p);

/**
 * warps a src image into a destination image based on a line correspondence
 */
Image *warp(Image *srcImg, line *srcLines, line *dstLines,
	    int numLines, Image *dstImg);

/**
 * notifies about the start of an image copy operation. does init stuff
 */
void startImgCopy(int width, int height);

/**
 * notifies about the finish of an image copy operation. does cleanup
 */
void doneImgCopy();

/**
 * copies a pixel from one image to another, handling sampling
 */
void copyPixel(Image *srcImg, point *srcPt, point *dstPt, Image *dstImg);

/**
 * performs bilinear interpolation
 */
char *bilinearInterp(Image* img, point *p, char* pixel);

/**
 * performs nearest neighbor interpolation
 */
char *nnInterp(Image* img, point *p, char* pixel);

/**
 * get the u value for a line and point
 */
float getU(line *pq, point *x);

/**
 * get the v value for a line and point
 */
float getV(line *pq, point *x);

/**
 * gets the point in the source image for a point in the dest image
 */
point *getXp(float u, float v, line *pqp, point *x, point *xp);

/**
 * gets the vector perpendicular to the line passed
 */
point *perpendicular(line *pq, point *perp);

/**
 * gets the distance from a point to a line
 */
float point2LineD(point* x, line* pq);

/**
 * gets the line length 
 */
float lineLength(line *n);

/**
 * gets the length between two points
 */
float length(point *p, point *q);

/**
 * gets the squared length between two points
 */
float slength(point *p, point *q);

/**
 * get location of linearly interpolated lines at a certain ratio
 */
void getLines(line *srcLines, line *dstLines, int numLines,
	      int fr, int numFrames, line *frDstLines);

/**
 * condition the lines to avoid numerical problems
 */
bool conditionLines(int numLines, line *srcLines);

/**
 * cross dissolves two images
 */
void crossDissolve(Image *frSrc, Image *frDst, float ratio, Image *fr);

/**
 * saves the frames to files
 */
void saveFrames(Image *frames);

/**
 * saves the lines to a file
 */
void saveLines();

/**
 * reads the lines from a file
 */
void readLines();

/** display related functions **/

/**
 * handles the user resizing the window
 */
void reshape(int w, int h);

/**
 * handles the update of the display screen
 */
void draw(void);

/**
 * draws the fixation point
 */
void drawFixation(void);

/**
 * post a buffer swap event
 */
void swapBuffers();

/**
 * post a display event
 */
void redisplay();


/** event handlers **/

/**
 * keyboard handler
 */
void keyboard(unsigned char key, int x, int y);

/**
 * error handler
 */
void CALLBACK error(GLenum errCode);


/** utility functions **/

/**
 * gets a gray image
 */
Image getGrayImg();

/** math stuff **/

/**
 * finds the max of two numbers 
 */
int maxi(int a, int b);
long maxl(long a, long b);
float maxf(float a, float b);
double maxd(double a, double b);

/**
 * finds the min of two numbers 
 */
int mini(int a, int b);
long minl(long a, long b);
float minf(float a, float b);
double mind(double a, double b);

/** string manip **/

/**
 * converts an integer to a string
 */
char *itoa(int i);

/* jon's jpeg functions */
void jpegFlip(Image*);
Image jpegRead(char*);
void jpegWrite(Image*, FILE *);

/**
 * gets the screen width
 */
int getScreenWidth();

/**
 * gets the screen height
 */
int getScreenHeight();

/**
 * gets the window width
 */
int getWindowWidth();

/**
 * gets the window height
 */
int getWindowHeight();

/**
 * draws a string at the specified coordinates
 */
void drawString(GLint x, GLint y, char* s, const GLfloat *color);

/** 
 * parse the command line args
 */
void parseArgs(int argc, char** argv);

/**
 * validate the input arguments
 */
bool validateArgs();

/**
 * runs the morphing operation
 */
void runMorph();

/**
 * main function to control the stimulator
 */
int main(int argc, char **argv);

#endif
