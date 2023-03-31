const SubCategory = require("../models/SubCategory");
const ChildCategory = require("../models/ChildCategory");
//@desc Get all child categories
//@route GET /category/:categoryId/subcategory/:subcategoryId/childcategory
//access  Public

exports.getChildCategories = async (req, res, next) => {
  try {
    const children = await ChildCategory.find();
    res
      .status(200)
      .json({ success: true, count: children.length, data: children });
  } catch (error) {
    res.status(400).json({ success: false });
  }
};

//@desc Get single child category
//@route GET /category/:categoryId/subcategory/:subcategoryId/childcategory/:id
//access  Public

exports.getChildCategory = async (req, res, next) => {
  try {
    const child = await ChildCategory.findById(req.params.id);

    if (!child) {
      return res.status(400).json({ success: false });
    }

    res.status(200).json({ success: true, data: child });
  } catch (error) {
    res.status(400).json({ success: false });
  }
};

//@desc Create new child category
//@route POST /category/:categoryId/subcategory/:subcategoryId/childcategory
//access Private

exports.createChildCategory = async (req, res, next) => {
  try {
    //create new child
    const child = await ChildCategory.create(req.body);

    res.status(201).json({
      success: true,
      data: child,
    });

    //take parent category id
    const { subcategoryId } = req.params;

    //find parent category by id
    const parentCategory = await SubCategory.findById(subcategoryId);

    child.subcategory = parentCategory;

    parentCategory.children.push(child);
    await parentCategory.save();
  } catch (error) {
    res.status(400).json({
      success: false,
    });
  }
};

//@desc Update child category
//@route PUT /category/:categoryId/subcategory/:subcategoryId/childcategory/:id
//access Private

exports.updateChildCategory = async (req, res, next) => {
  try {
    const child = await ChildCategory.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!child) {
      return res.status(400).json({ success: false });
    }

    res.status(200).json({ success: true, data: child });
  } catch (error) {
    res.status(400).json({ success: false });
  }
};

//@desc Delete child category
//@route DELETE /category/:categoryId/subcategory/:subcategoryId/childcategory
//access Private

exports.deleteChildCategory = async (req, res, next) => {
  try {
    const child = await ChildCategory.findByIdAndDelete(req.params.id);

    if (!child) {
      return res.status(400).json({ success: false });
    }

    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(400).json({ success: false });
  }
};
