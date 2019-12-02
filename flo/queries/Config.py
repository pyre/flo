# -*- Python -*-
# -*- coding: utf-8 -*-
#
# michael a.g. aïvázis <michael.aivazis@para-sim.com>
# parasim
# (c) 1998-2019 all rights reserved
#


# support
import flo
# from .. import db, schema


# the query declaration
class Config(flo.db.query, config=flo.schema.config):
    """
    Retrieve configuration settings associated with a specif flow
    """

    # the fields
    name = config.name
    value = config.value


    # meta-methods
    def __init__(self, flow=None, **kwds):
        # chain up
        super().__init__(**kwds)

        # get my class so i can refer to my fields
        cls = type(self)
        # initialize the restriction
        where = cls.where
        # grab the config table
        config = cls.pyre_tables["config"]

        # if the caller supplied a flow name
        if flow is not None:
            # here is the restriction i propose
            restriction = (config.flow == flow)
            # update
            where = (where & restriction) if where is not None else restriction

        # attach
        self.where = where

        # all done
        return


# end of file
