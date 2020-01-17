# Keeping the cluster in its own module allows us to build it independently of
# every other k8s resources that lives on it. This is essential when first
# running `terraform apply`.
module "cluster" {
  do_dish_key = var.do_dish_key
  source = "./cluster"
}
