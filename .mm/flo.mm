# -*- Makefile -*-
#
# michael a.g. aïvázis
# parasim
# (c) 1998-2018 all rights reserved
#


# project meta-data
flo.major := $(repo.major)
flo.minor := $(repo.minor)
flo.micro := $(repo.micro)
flo.revision := $(repo.revision)

# flo consists of a python package
flo.packages := flo.pkg
# libraries
flo.libraries :=
# python extensions
flo.extensions :=
# and some tests
flo.tests :=

# the flo package meta-data
flo.pkg.root := flo/
flo.pkg.stem := flo
flo.pkg.drivers := flo

# end of file
