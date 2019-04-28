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
class Names(flo.flow.workflow, family="flo.applications.names"):
    """
    Examine the flow node naming straregy
    """


    # interface
    @flo.export
    def main(self, *args, **kwds):
        """
        The main entry point
        """
        # make a channel
        channel = self.info
        # sign on
        channel.line("making a flo")
        channel.line("  products:")
        for product in self.products:
            channel.line(f"    {product}")
        channel.line("  factories:")
        for factory in self.factories:
            channel.line(f"    {factory}")
        channel.log()

        # grab the SLC product
        slc = flo.isce.slc()
        # make one
        s1 = slc()
        channel.log(f"slc: {s1}")

        # grab the SLC factory
        formSLC = flo.isce.formSLC()
        # make one
        f = formSLC()

        # access the input
        raw = f.raw
        # and the output
        s1 = f.slc

        channel.line(f"slc factory: {f}")
        channel.line(f"    raw: {f.raw}")
        channel.line(f"    slc: {f.slc}")
        channel.log()

        # all done
        return 0


# bootstrap
if __name__ == "__main__":
    # instantiate
    app = Names(name="names")
    # invoke
    status = app.run()
    # and share
    raise SystemExit(status)


# end of file
