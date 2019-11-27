# -*- Python -*-
# -*- coding: utf-8 -*-
#
# michael a.g. aïvázis <michael.aivazis@para-sim.com>
# parasim
# (c) 1998-2019 all rights reserved
#

# get db support
from .. import db


# pull the literals, for convenience
null = db.null
default = db.default


# get the tables
from .Flow import Flow as flows
from .Config import Config as config

# sort them in dependency order
tables = [ config, flows ]


# end of file
