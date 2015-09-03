############################################################################
# Makefile for an opengl template
# Oliver Hinds <oph@bu.edu> 2004-01-22
# 
# This application is free software; you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by the
# Free Software Foundation; either version 2 of the License, or (at your
# option) any later version.
# 
# CVCNS Central Field Retinotopy Stimulator is distributed in the hope that
# it will be useful, but WITHOUT ANY WARRANTY; without even the implied
# warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License along
# with this application; if not, write to the Free Software Foundation,
# Inc., 59 Temple Place, Suite 330, Boston, MA 02111-1307 USA
#######################################################################

# project name
PROJECT = immorph
OS = linux
DEBUG = 1

################################ APPS ################################

RM = /bin/rm -v
ECHO = /bin/echo
CC = /usr/bin/gcc

# location of the X includes and libraries
X_INCS = -I/usr/X11R6/include
X_LIBS = -L/usr/X11R6/lib -lXext -lX11 -lXmu -lXi

# location of the OpenGL includes and libraries
GL_INCS = -I/usr/include
GL_LIBS = -L/usr/lib -lglut -lGLU -lGL

# mac specific stuff
LIBDIR  = -L"/System/Library/Frameworks/GLUT.framework"
LIBDIR += -L"/System/Library/Frameworks/OpenGL.framework/Libraries"

FRAMEWORK = -framework GLUT
FRAMEWORK += -framework OpenGL
FRAMEWORK += -framework Carbon
LIBRARIES = -lGL -lGLU -lm -lobjc

# debug? yes or no?
ifeq ($(DEBUG),1)
	DEBUG_FLAG = -g
else
	DEBUG_FLAG = -O3
endif

# flags for the compiler and linker
CFLAGS =  -Wall $(GL_INCS) $(X_INCS) $(DEBUG_FLAG)

ifeq ($(OS),mac)
	JPEG_INCS = -I/usr/local/include
	JPEG_LIBS = -L/usr/local/lib -ljpeg

	CFLAGS += -DMAC $(JPEG_INCS)
	LDFLAGS = $(FRAMEWORK) $(LIBDIR) $(LIBRARIES) $(JPEG_LIBS)
else
	JPEG_INCS = -I/usr/include
	JPEG_LIBS = -L/usr/lib -ljpeg

	CFLAGS += $(JPEG_INCS)
	LDFLAGS = $(GL_LIBS) $(X_LIBS) $(JPEG_LIBS) -lm
endif

############################## SUFFIXES ##############################

## if any command to generate target fails, the target is deleted.
# (see http://www.gnu.org/manual/make/html_chapter/make_5.html#SEC48)
.DELETE_ON_ERROR:

.SUFFIXES:
.SUFFIXES:  .o .c

## files that are included
GLOBAL_FILES =

## suffix rule for subsidiary source files
# (see http://www.gnu.org/manual/make/html_chapter/make_10.html#SEC111)
%.o: %.c %.h 
	@$(ECHO) '[make: building $@]'
	$(CC) -c $< $(CFLAGS)

HDR_FILES = $(wildcard *.h)
SRC_FILES = $(wildcard *.c)
OBJ_FILES = $(SRC_FILES:.c=.o) 

############################## TARGETS ###############################

default: $(PROJECT)
all:     $(PROJECT)

$(PROJECT): $(OBJ_FILES)
	@$(ECHO) 'make: building $@...'
	$(CC) $(CFLAGS) $(LDFLAGS) $(OBJ_FILES) $(EXTRA_OBJ) -o $(PROJECT)
	@$(ECHO) '############################################'
	@$(ECHO) 'make: built [$@] successfully!'
	@$(ECHO) '############################################'

############################### CLEAN ################################

clean:
	@$(ECHO) 'make: removing object and autosave files'
	-$(RM) -f *.o *~

cleanall: clean
	@$(ECHO) 'make: removing $(PROJECT) executable'
	-/bin/rm -f $(PROJECT)

######################################################################
### $Source: /usr/users/oph/cvs/COURSES/CS580-assign1/CODE/makefile,v $
### Local Variables:
### mode: makefile
### fill-column: 76
### comment-column: 0
### End: 
