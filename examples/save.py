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

        # sign on
        channel.line(f"{self}")
        channel.line(f"  flow: {self.flow}")
        channel.log()
        # print(f"  products: {self.products}")
        # print(f"  factories: {self.factories}")
        # all done
        return 0

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

        # park them in my attributes
        self.factories = {f}
        self.products = {raw, slc}

        # pick a format
        fmt = 'pfg'
        # make a weaver
        weaver = flo.weaver.weaver()
        # pick the language
        weaver.language = fmt
        # open a file
        with open(f"{self.pyre_name}.{fmt}", mode="w") as stream:
            # make the document
            document = self.pyre_render(renderer=weaver.language)
            # get the weaver to do its thing
            for line in weaver.weave(document=document):
                # place in the file
                print(line, file=stream)

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
