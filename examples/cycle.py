#!/usr/bin/env python3
# -*- Python -*-
# -*- coding: utf-8 -*-
#
# michael a.g. aïvázis <michael.aivazis@para-sim.com>
# parasim
# (c) 1998-2019 all rights reserved
#


# get the package
import flo

# my app
class Cycle(flo.application, family="flo.applications.cycle"):
    """
    Construct a circular flow
    """

    # user configurable state
    flow = flo.flow.flow()
    flow.doc = "my flow node container"


    # interface
    @flo.export
    def main(self, *args, **kwds):
        """
        The main entry point
        """
        # make a channel
        channel = self.info

        # make a new SLC factory
        f = flo.isce.newFormSLC()
        # make a RAW
        raw = flo.isce.newRAW()
        # make an SLC
        slc = flo.isce.newSLC()
        # make a cycle
        f.raw = raw
        f.slc = raw

        # all done
        return 0


# bootstrap
if __name__ == "__main__":
    # instantiate
    app = Cycle(name="cycle")
    # invoke
    status = app.run()
    # and share
    raise SystemExit(status)


# end of file
