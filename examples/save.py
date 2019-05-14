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
class Save(flo.application, family="flo.applications.save"):
    """
    Examine the flow node naming strategy
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
        channel.line("after construction:")
        # make a RAW
        raw = flo.isce.newRAW()
        # configure it
        raw.samples = 5000
        raw.lines = 15000
        # make an SLC
        slc = flo.isce.newSLC()
        # bind everything together
        f.raw = raw
        f.slc = slc

        # get my flow
        flow = self.flow
        # add the products and factories
        flow.factories = {f}
        flow.products = {raw, slc}
        # and ask it to render itself
        flow.save()

        # all done
        return 0


# bootstrap
if __name__ == "__main__":
    # instantiate
    app = Save(name="save")
    # invoke
    status = app.run()
    # and share
    raise SystemExit(status)


# end of file
